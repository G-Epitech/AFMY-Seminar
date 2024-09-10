export enum ClotheType {
  HAT_CAP = "Hat/Cap",
  BOTTOM = "Bottom",
  TOP = "Top",
  SHOES = "Shoes",
}

export type Clothe = {
  id: number;
  legacyId: number | null;
  type: ClotheType;
  image: string;
};

export type ClothesFilters = {
  type?: ClotheType;
};
