import { CardBrief } from "./card.interface";
import { SerieBrief } from "./serie.interface";

export interface CardCount {
  total?: number;
  official?: number;
  reverse?: number;
  holo?: number;
  firstEd?: number;
};

interface Legal {
  standard: boolean;
  expanded: boolean;
}

export interface Set {
  id: string;
  name: string;
  logo: string | undefined;
  symbol: string;
  cardCount: CardCount;
  serie: SerieBrief;
  tcgOnline: string;
  releaseDate: string;
  legal: Legal;
  cards: CardBrief[]
}

export interface SetBrief {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  cardCount: CardCount;
};