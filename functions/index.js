import { onRequest } from 'firebase-functions/v2/https';
import { onMessagePublished } from "firebase-functions/v2/pubsub";
import EbayAuthToken from 'ebay-oauth-nodejs-client';
import admin from "firebase-admin";


const APP_ID = process.env.EBAY_APP_ID;
const CERT_ID = process.env.EBAY_CERT_ID;

if (!admin.apps.length) {
  admin.initializeApp(); // ✅ Initialise Firebase Admin SDK une seule fois
}
const db = admin.database();

const ebayAuth = new EbayAuthToken({
  clientId: APP_ID,
  clientSecret: CERT_ID,
});


export const searchEbayItems = onRequest({ cors: true },
  async (req, res) => {
    try {
      const token = await ebayAuth.getApplicationToken("PRODUCTION", ["https://api.ebay.com/oauth/api_scope"]);
      if (!token) throw new Error("Impossible d'obtenir un token OAuth valide.");


      const query = req.query.q || "ETB Forces temporelles";
      const searchResponse = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_FR",
            "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=FR,zip=75001",
            "Content-Language": "fr-FR",
          },
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`Erreur lors de la recherche des items : ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      res.status(200).send(searchData);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ error: error.message });
    }
  }
);

const searchCardOnEbay = async (query) => {
  try {
    const token = await ebayAuth.getApplicationToken("PRODUCTION", ["https://api.ebay.com/oauth/api_scope"]);
    if (!token) throw new Error("Impossible d'obtenir un token OAuth valide.");

    const searchResponse = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&filter=categoryId:183454,buyingOptions:{FIXED_PRICE}`,

      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_FR",
          "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=FR,zip=75001",
          "Content-Language": "fr-FR",
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Erreur lors de la recherche des items : ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    return searchData
  } catch (error) {
    console.error("Erreur :", error);
  }
}

export const updateEbayPricesForCardId = onRequest({ cors: true },
  async (req, res) => {
    try {
      const { serieId, setId, cardId } = req.query;
      if (!setId || !cardId) {
        return res.status(400).json({ error: "❌ Paramètres manquants : setId et cardId sont requis." });
      }
      const cardRef = db.ref(`cards/${serieId}/${setId}/${cardId}`)
      const snapShot = await cardRef.once("value");
      if (!snapShot.exists()) {
        console.log("❌ Aucune carte trouvé !");
        return;
      }
      const card = snapShot.val();

      console.log(`🔎 Recherche eBay pour : ${card.ebaySearchContent}`);
      const ebayData = await searchCardOnEbay(card.ebaySearchContent);

      if (ebayData && ebayData.itemSummaries && ebayData.itemSummaries.length > 0) {
        const priceArray = ebayData.itemSummaries
          .map((item) => parseFloat(item.price.value))
          .filter((price) => !isNaN(price));

        if (priceArray.length > 0) {
          const averagePrice = priceArray.reduce((sum, price) => sum + price, 0) / priceArray.length;
          const lowestPrice = Math.min(...priceArray);
          const highestPrice = Math.max(...priceArray);

          const updatedCard = {
            ...card,
            averagePrice: parseFloat(averagePrice.toFixed(2)),
            lowestPrice: parseFloat(lowestPrice.toFixed(2)),
            highestPrice: parseFloat(highestPrice.toFixed(2)),
            lastPriceUpdate: new Date().toISOString(),
          };

          await cardRef.set(updatedCard);
          return res.status(200).json({ ...updatedCard, id: cardId })
        }
        return res.status(204).json({ message: `⏳ Aucun prix trouvé pour ${cardId} sur eBay.` });
      }
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: error.message });
    }
  }
)


export const dailyJobPrices = onMessagePublished("cron-topic", async (event) => {
  console.log("✅ dailyJobPrices déclenché !");
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  const message = event.data?.message?.data
    ? Buffer.from(event.data.message.data, "base64").toString()
    : "";

  if (message !== "dailyJobPrices") {
    console.log("⏩ Ignoré : Ce message ne concerne pas dailyJobPrices.");
    return;
  }
  try {
    const setsSnapshot = await db.ref("cards/sv").once("value");
    if (!setsSnapshot.exists()) {
      console.log("❌ Aucun set trouvé !");
      return;
    }
    console.log("✅ set trouvé")
    const sets = setsSnapshot.val();
    for (const setId of Object.keys(sets)) {

      const cardsSnapshot = await db.ref(`cards/sv/${setId}`).once("value");
      if (!cardsSnapshot.exists()) {
        console.log(`❌ Aucun carte trouvée pour le set ${setId}`);
        continue;
      }
      const cards = cardsSnapshot.val();
      console.log(`📌 ${Object.keys(cards).length} cartes trouvées dans ${setId}`);

      // 📌 Lancer toutes les requêtes eBay en parallèle
      const priceUpdatePromises = Object.keys(cards).map(async (cardId) => {
        const card = cards[cardId];
        const ebaySearchContent = card.ebaySearchContent;

        // ✅ Vérification du `lastPriceUpdate`
        if (card.lastPriceUpdate) {
          const lastUpdateTime = new Date(card.lastPriceUpdate).getTime();
          const currentTime = Date.now();
          if (currentTime - lastUpdateTime < TWO_HOURS) {
            console.log(`⏳ Ignoré : ${ebaySearchContent} (mise à jour récente il y a moins de 2h)`);
            return null;
          }
        }

        console.log(`🔎 Recherche eBay pour : ${ebaySearchContent}`);
        const ebayData = await searchCardOnEbay(ebaySearchContent);
        if (ebayData && ebayData.itemSummaries && ebayData.itemSummaries.length > 0) {
          const priceArray = ebayData.itemSummaries
            .map((item) => parseFloat(item.price.value))
            .filter((price) => !isNaN(price));

          if (priceArray.length > 0) {
            const averagePrice = priceArray.reduce((sum, price) => sum + price, 0) / priceArray.length;
            const lowestPrice = Math.min(...priceArray);
            const highestPrice = Math.max(...priceArray);

            // ✅ On ne met pas à jour tout de suite, on retourne la requête Firebase
            return db.ref(`cards/sv/${setId}/${cardId}`).set({
              ...card,
              averagePrice: parseFloat(averagePrice.toFixed(2)),
              lowestPrice: parseFloat(lowestPrice.toFixed(2)),
              highestPrice: parseFloat(highestPrice.toFixed(2)),
              lastPriceUpdate: new Date().toISOString(),
            });
          }
        }
        return null;
      });

      // 📌 Attendre que toutes les requêtes eBay et Firebase soient terminées
      await Promise.all(priceUpdatePromises);
      console.log(`✅ Mise à jour terminée pour le set ${setId}`);
    }
  } catch (error) {
    console.error("❌ Erreur dans le job quotidien :", error);
  }
});


// https://api.ebay.com/buy/browse/v1/item_summary/search?q=Pikachu-ex%20179/131&filter=categoryId:183454,buyingOptions:{FIXED_PRICE}