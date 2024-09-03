export enum ClothesType {
  HAT_CAP = "Hat/Cap",
  BOTTOM = "Bottom",
  TOP = "Top",
  SHOES = "Shoes",
}

export type Clothes = {
  id: number;
  legacyId?: number;
  type: ClothesType;
  image: string;
};
