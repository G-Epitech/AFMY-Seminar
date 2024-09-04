import { IdOf } from "../utils";
import { Employee } from "./employee.type";

export enum Gender {
  MA = "Male",
  FE = "Female",
  OT = "Other",
}

export enum AstrologicalSign {
  ARIES = "Aries",
  TAURUS = "Taurus",
  GEMINI = "Gemini",
  CANCER = "Cancer",
  LEO = "Leo",
  VIRGO = "Virgo",
  LIBRA = "Libra",
  SCORPIO = "Scorpio",
  SAGITTARIUS = "Sagittarius",
  CAPRICORN = "Capricorn",
  AQUARIUS = "Aquarius",
  PISCES = "Pisces",
}

export type Customer = {
  id: number;
  legacyId: number | null;
  email: string;
  name: string;
  surname: string;
  description: string;
  birthDate: Date;
  gender: Gender;
  sign: AstrologicalSign;
  phone: string | null;
  photo: string | null;
  address: string | null;
  coachId: IdOf<Employee>;
  createdAt: Date;
};

export enum PaymentMethod {
  PAYPAL = "Paypal",
  BANK_TRANSFER = "Bank Transfer",
  CREDIT_CARD = "Credit Card",
}

export type Payment = {
  id: number;
  legacyId?: number;
  date: Date;
  amount: number;
  method: PaymentMethod;
  comment: string | null;
  customerId: IdOf<Customer>;
};
