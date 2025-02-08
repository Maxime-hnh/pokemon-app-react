import { onRequest } from 'firebase-functions/v2/https';
// import { functions } from 'firebase-functions';
import EbayAuthToken from 'ebay-oauth-nodejs-client';


const APP_ID = process.env.EBAY_APP_ID;
const CERT_ID = process.env.EBAY_CERT_ID;

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

// export const dailyJobPrices = functions.pubsub.topic("nom-du-topic").onPublish((message) => {
//   console.log("Job quotidien déclenché !");


//   // Ajoute ici ton code métier
//   return Promise.resolve();
// });
