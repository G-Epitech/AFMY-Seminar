type IdOf<T> = T extends { id: infer U } ? U : never;

enum Gender {
  MA = 'Male',
  FE = 'Female',
  OT = 'Other'
}

enum AstrologicalSign {
  ARIES = 'Aries',
  TAURUS = 'Taurus',
  GEMINI = 'Gemini',
  CANCER = 'Cancer',
  LEO = 'Leo',
  VIRGO = 'Virgo',
  LIBRA = 'Libra',
  SCORPIO = 'Scorpio',
  SAGITTARIUS = 'Sagittarius',
  CAPRICORN = 'Capricorn',
  AQUARIUS = 'Aquarius',
  PISCES = 'Pisces'
}

type Customer = {
  id: number;
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
}

enum PaymentMethod {
  PAYPAL = 'Paypal',
  BANK_TRANSFER = 'Bank Transfer',
  CREDIT_CARD = 'Credit Card'
}

type Payment = {
  id: number;
  date: Date;
  amount: number;
  method: PaymentMethod;
  comment: string | null;
  customerId: IdOf<Customer>;
}

enum Permission {
  MANAGER,
  COACH
}

type Employee = {
  id: number;
  email: string;
  name: string;
  surname: string;
  birthDate: Date;
  gender: Gender;
  phone: string | null;
  photo: string | null;
  address: string | null;
  permission: Permission;
  role: string;
}

type EventLocation = {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  }
}

type MeetingEvent = {
  id: number;
  title: string;
  date: Date;
  maxParticipants: number;
  locationId: IdOf<EventLocation>;
  type: string;
  employeeId: IdOf<Employee>;
}

enum EncounterStatus {
  PENDING = 'Pending',
  DONE = 'Done',
  CANCELED = 'Canceled'
}

type Encounter = {
  id: number;
  customerId: IdOf<Customer>;
  date: Date;
  rating: number | null;
  comment: string | null;
  source: string;
  status: EncounterStatus;
  isPositive: boolean | null;
}

type Tip = {
  id: number;
  title: string;
  content: string;
}

enum ClothesType {
  HAT_CAP = 'Hat/Cap',
  BOTTOM = 'Bottom',
  TOP = 'Top',
  SHOES = 'Shoes'
}

type Clothes = {
  id: number;
  type: ClothesType;
  image: string;
}
