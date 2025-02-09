import { ref, set, remove, get } from "firebase/database";
import { auth, db } from "../_config/firebaseConfig";
import { sanitizeKey } from "../_helpers/helpers";
import { tcgdexService } from "./tcgdex.service";
import { ebayService } from "./ebay.service";
import { Card } from "../_interfaces/card.interface";

class DbFirebaseService {

  constructor() {
  }

  linkCardById = async (setId: string, cardId: string): Promise<void> => {
    if (!auth.currentUser?.uid) return;
    const safeSetId = sanitizeKey(setId);
    const safeCardId = sanitizeKey(cardId);
    const cardRef = ref(db, `users/${auth.currentUser?.uid}/sets/${safeSetId}/cards/${safeCardId}`);
    await set(cardRef, true);
  };


  unLinkCardById = async (setId: string, cardId: string): Promise<void> => {
    if (!auth.currentUser?.uid) return;
    const safeSetId = sanitizeKey(setId);
    const safeCardId = sanitizeKey(cardId);
    const cardRef = ref(db, `users/${auth.currentUser?.uid}/sets/${safeSetId}/cards/${safeCardId}`);
    await remove(cardRef);
  };




  getMyCards = async (setId: string): Promise<string[] | void> => {
    if (!auth.currentUser?.uid) return;
    const safeSetId = sanitizeKey(setId);
    const listRef = ref(db, `users/${auth.currentUser.uid}/sets/${safeSetId}/cards`);
    const snapshot = await get(listRef);

    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  };

  insertCards = async (serieId: string): Promise<any> => {
    try {
      const serie = await tcgdexService.getSerieById(serieId)
      if (serie) {
        for (const setData of serie.sets) {
          const setWithCards = await tcgdexService.getSetById(setData.id)
          if (setWithCards) {
            const insertions = setWithCards.cards.map((async (card) => {
              const fullDataCard = await tcgdexService.getCardById(card.id)

              const containsAlphabet = /[a-zA-Z]/.test(card.localId);
              const ebaySearchContent = card.name
                + ' '
                + card.id.slice(-3)
                + (containsAlphabet ? '' : '/' + setWithCards.cardCount.official
                )
              //cardName exemple = Évoli-ex 167/131
              const cardRef = ref(db, `cards/${sanitizeKey(serie.id)}/${sanitizeKey(setData.id)}/${sanitizeKey(card.id)}`);


              await set(cardRef, {
                name: fullDataCard!.name,
                localId: fullDataCard!.localId,
                image: fullDataCard!.image,
                rarity: fullDataCard!.rarity,
                variants: fullDataCard!.variants,
                ebaySearchContent,
                averagePrice: 0,
                highestPrice: 0,
                lowestPrice: 0,
                createdat: new Date().toISOString(),
                lastPriceUpdate: null,
                cardCount: { official: setWithCards.cardCount.official }
              });

            }));
            await Promise.all(insertions);
          }
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'insertion des cartes :", error);
    }
  };

  testGetPrice = async () => {
    try {
      const setsRef = ref(db, "cards/sv")
      const setsSnapshot = await get(setsRef)
      if (!setsSnapshot.exists()) {
        console.log("❌ Aucun set trouvé !");
        return;
      }
      const sets = setsSnapshot.val();
      for (const setId of Object.keys(sets)) {
        const cardsRef = ref(db, `cards/sv/${setId}`);
        const cardsSnapshot = await get(cardsRef);

        if (!cardsSnapshot.exists()) {
          console.log(`❌ Aucun carte trouvée pour le set ${setId}`);
          continue;
        }
        const cards = cardsSnapshot.val(); // Objet contenant toutes les cartes
        console.log(`📌 ${Object.keys(cards).length} cartes trouvées dans ${setId}`);

        for (const cardId of Object.keys(cards)) {
          const cardName = cards[cardId].name;

          const ebayData = await ebayService.searchEbayItems(cardName);
          if (ebayData) {
            const priceArray = ebayData.itemSummaries
              .map((item: any) => parseFloat(item.price.value))
              .filter((price: any) => !isNaN(price));

            if (priceArray.length > 0) {
              const averagePrice = priceArray.reduce((sum: number, price: number) => sum + price, 0) / priceArray.length;
              const lowestPrice = Math.min(...priceArray);
              const highestPrice = Math.max(...priceArray);
            }
            console.log('ok')
          }
        }

      }
    } catch (error) {
      console.error(error)
    }

    return Promise.resolve();
  }
}

export const dbFirebaseServie = new DbFirebaseService();