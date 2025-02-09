import { get, ref } from "firebase/database";
import { Card, CardBrief } from "../_interfaces/card.interface";
import { db } from "../_config/firebaseConfig";
import { handleResponse } from "../_helpers/handleResponse";
import { sanitizeKey } from "../_helpers/helpers";

const UPDATE_EBAYPRICES_URL = import.meta.env.VITE_FIREBASE_FUNCTION_UPDATE_EBAYPRICES_FOR_CARDID;


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
  };

  updateEbayPrices = async (serieId: string, setId: string, cardId: string): Promise<CardBrief | void> => {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
    try {
      const response = await handleResponse(
        await fetch(`${UPDATE_EBAYPRICES_URL}?serieId=${encodeURIComponent(serieId)}&setId=${encodeURIComponent(sanitizeKey(setId))}&cardId=${encodeURIComponent(cardId)}`, requestOptions)
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de l'appel à Firebase :", error);
      throw error;
    }
  }
}

export const cardService = new CardService();