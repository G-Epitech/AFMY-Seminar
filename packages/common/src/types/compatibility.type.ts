import { Customer } from "./customer.type";

export enum CompatibilityType {
  OVERALL = "Overall",
  LOVE_MARIAGE = "Love & Mariage",
  SEX = "Sex",
  COMMUNICATION = "Communication",
}

export type Compatibility = {
  [key in CompatibilityType]: 1 | 2 | 3 | 4 | 5;
} & {
  score:
    | 100
    | 95
    | 90
    | 85
    | 80
    | 75
    | 70
    | 65
    | 60
    | 55
    | 50
    | 45
    | 40
    | 35
    | 30
    | 25
    | 20
    | 15
    | 10
    | 5
    | 0;
};

export type FullCompatibility = {
  compatibility: Compatibility;
  customerA: Customer;
  customerB: Customer;
};
