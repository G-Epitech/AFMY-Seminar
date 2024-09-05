import { Customer } from "./customer.type";

export enum CompatibilityType {
  OVERALL = "Overall",
  LOVE_MARIAGE = "Love & Mariage",
  SEX = "Sex",
  COMMUNICATION = "Communication",
}

export type Compatibility = {
  compatibility: { [key in CompatibilityType]: number }; // 0-5
  score: number; // 0-100
  customerA: Customer;
  customerB: Customer;
};
