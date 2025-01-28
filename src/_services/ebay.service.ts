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
}

export const ebayService = new EbayService();