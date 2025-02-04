import { handleResponse } from "../_helpers/handleResponse";

const BASE_URL = "https://us-central1-pokemon-app.cloudfunctions.net/searchEbayItems";

class EbayService {

  constructor() {
  }

  searchOnEbay = (cardName: string, cardId: string, localId: string, cardCountOfficial?: number): void => {
    if (cardCountOfficial) {

      const containsAlphabet = /[a-zA-Z]/.test(localId);
      const ebayUrl = `https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(
        cardName
        + ' '
        + cardId.slice(-3)
        + (containsAlphabet
          ? ''
          : '/' + cardCountOfficial
        )
      )}`;
      window.open(ebayUrl, '_blank');
    }
  }



  searchEbayItems = async (query: any) => {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
    try {
      const response = await handleResponse(await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`, requestOptions));
      return response;
    } catch (error) {
      console.error("Erreur lors de l'appel à Firebase :", error);
      throw error;
    }
  }
}

export const ebayService = new EbayService();