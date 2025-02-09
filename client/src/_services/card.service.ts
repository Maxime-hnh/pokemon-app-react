import { get, ref } from "firebase/database";
import { Card } from "../_interfaces/card.interface";
import { db } from "../_config/firebaseConfig";

class CardService {
  constructor() {
  };

  getCardsBySetId = async (serieId: string, setId: string): Promise<Card[] | void> => {
    const cardsRef = ref(db, `cards/${serieId}/${setId}`)
    const snapShot = await get(cardsRef);

    if (snapShot.exists()) {
      const cardsData = snapShot.val();

      return Object.keys(cardsData).map((cardId) => ({
        id: cardId,
        ...cardsData[cardId]
      }));
    }
  }
}

export const cardService = new CardService();