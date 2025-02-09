import { CardCount, SetBrief } from "./set.interface";

export enum Rarities {
  ACE_SPEC_RARE = "ACE SPEC Rare",
  AMAZING_RARE = "Amazing Rare",
  CLASSIC_COLLECTION = "Classic Collection",
  COMMON = "Common",
  CROWN = "Crown",
  DOUBLE_RARE = "Double rare",
  FOUR_DIAMOND = "Four Diamond",
  FULL_ART_TRAINER = "Full Art Trainer",
  HOLO_RARE = "Holo Rare",
  HOLO_RARE_V = "Holo Rare V",
  HOLO_RARE_VMAX = "Holo Rare VMAX",
  HOLO_RARE_VSTAR = "Holo Rare VSTAR",
  HYPER_RARE = "Hyper rare",
  ILLUSTRATION_RARE = "Illustration rare",
  LEGEND = "LEGEND",
  NONE = "None",
  ONE_DIAMOND = "One Diamond",
  ONE_STAR = "One Star",
  RADIANT_RARE = "Radiant Rare",
  RARE = "Rare",
  RARE_HOLO = "Rare Holo",
  RARE_HOLO_LV_X = "Rare Holo LV.X",
  RARE_PRIME = "Rare PRIME",
  SECRET_RARE = "Secret Rare",
  SHINY_ULTRA_RARE = "Shiny Ultra Rare",
  SHINY_RARE = "Shiny rare",
  SHINY_RARE_V = "Shiny rare V",
  SHINY_RARE_VMAX = "Shiny rare VMAX",
  SPECIAL_ILLUSTRATION_RARE = "Special illustration rare",
  THREE_DIAMOND = "Three Diamond",
  THREE_STAR = "Three Star",
  TWO_DIAMOND = "Two Diamond",
  TWO_STAR = "Two Star",
  ULTRA_RARE = "Ultra Rare",
  UNCOMMON = "Uncommon"
}

interface Variants {
  normal: boolean;
  rever: boolean;
  holo: boolean;
  firstEdition: boolean;
}


export interface Card {
  id: string;
  localId: string | number;
  name: string;
  image: string;
  category: string;
  illustrator: string;
  rarity: string;
  variants: Variants;
  set: SetBrief;
  cardCount?: CardCount;

};

export interface CardBrief {
  id: string;
  localId: string;
  name: string;
  image: string;

  averagePrice?: number;
  highestPrice?: number;
  lowestPrice?: number;
  ebaySearchContent?: string;

  rarity?: string;
  variants?: string[];

  createdat?: string;
  lastPriceUpdate?: string | null;
  cardCount?: CardCount;
}