import TCGdex from '@tcgdex/sdk'
import { Set } from '../_interfaces/set.interface';
import { handleResponse } from '../_helpers/handleResponse';
import { Serie } from '../_interfaces/serie.interface';
import { Card, CardBrief } from '../_interfaces/card.interface';


class TCGDexService {
  private tcgdex: TCGdex;

  constructor() {
    this.tcgdex = new TCGdex('fr');
  }


  getSeries = async (): Promise<Serie[] | void> => {
    return await handleResponse(await fetch('https://api.tcgdex.net/v2/fr/series?sort:field=releaseDate&sort:order=DESC'));
  };

  getSets = async (): Promise<Set[] | void> => {
    return await handleResponse(await fetch('https://api.tcgdex.net/v2/fr/sets?sort:field=releaseDate&sort:order=DESC'));
  };

  getSetById = async (setId: string): Promise<Set | void> => {
    return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/sets/${setId}`))
    // const cards = await Promise.all(
    //   set.cards.map(async (card: CardBrief) => {
    //     return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards/${card.id}`));
    //   })
    // );
    // return { ...set, cards };
  }

  getCardById = async (cardId: string): Promise<Card | void> => {
    return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards/${cardId}`))
  }


  getSeriesWithSet = async (): Promise<Serie[] | void> => {
    const series = await this.getSeries();
    const sets = await this.getSets();
    if (sets) {
      const customSets = sets.map((set: Set) => (
        {
          ...set,
          logo: this.getImageUrl(set.logo!, 'png')
        }
      ))
      const customSeries = series!.map((serie: Serie, index: number) => (
        {
          ...serie,
          index,
          logo: this.getImageUrl(serie.logo!, 'png'),
          sets: customSets.filter((set: Set) => set.id.startsWith(serie.id))
        }
      ))
      return customSeries
    }
  }

  searchCard = async (searchValue: string, serie?: string): Promise<Card[] | void> => {
    if (serie) {
      return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards?id=like:${serie}&name=like:${searchValue}`));
    } else {
      const cards = await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards?name=like:${encodeURIComponent(searchValue)}`))
      if (cards) {
        const fullCardsData = await Promise.all(cards.map(async (card: Card) => {
          const fullDataCard = await this.getCardById(card.id);
          const set = await this.getSetById(fullDataCard!.set.id);
          return {
            ...fullDataCard,
            cardCount: set ? { official: set.cardCount.official } : {}
          };
        }));
        return fullCardsData;
      }
    }
  }

  getImageUrl(url: string, extension: string, quality?: string): string | undefined {
    if (url) {

      if (quality) {
        return `${url}/${quality}.${extension}`;
      } else {
        return `${url}.${extension}`;
      }
    } else {
      return undefined
    }
  };
}

export const tcgdexService = new TCGDexService();