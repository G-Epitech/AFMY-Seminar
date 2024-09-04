export interface ClotheLegacyDto {
  id: number;
  type: string;
}

export interface CredentialsLegacyDto {
  email: string;
  password: string;
}

export interface CustomerLegacyDto {
  id: number;
  email: string;
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  description: string;
  astrological_sign: string;
  phone_number: string;
  address: string;
}

export interface EmployeeLegacyDto {
  id: number;
  email: string;
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  work: string;
}

export interface EncounterLegacyDto {
  id: number;
  customer_id: number;
  date: string;
  rating: number;
  comment: string;
  source: string;
}

export interface EventLegacyDto {
  id: number;
  name: string;
  date: string;
  duration: number;
  max_participants: number;
  location_x: string;
  location_y: string;
  type: string;
  employee_id: number;
  location_name: string;
}

export interface HTTPErrorLegacyDto {
  detail: string;
}

export interface HTTPValidationErrorLegacyDto {
  detail: Array<ValidationErrorLegacyDto>;
}

export interface ItemsLegacyDto {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface PaymentHistoryLegacyDto {
  id: number;
  date: string;
  payment_method: string;
  amount: number;
  comment: string;
}

export interface ShortCustomerLegacyDto {
  id: number;
  email: string;
  name: string;
  surname: string;
}

export interface ShortEmployeeLegacyDto {
  id: number;
  email: string;
  name: string;
  surname: string;
}

export interface ShortEncounterLegacyDto {
  id: number;
  customer_id: number;
  date: string;
  rating: number;
}

export interface ShortEventLegacyDto {
  id: number;
  name: string;
  date: string;
  duration: number;
  max_participants: number;
}

export interface TipLegacyDto {
  id: number;
  title: string;
  tip: string;
}

export interface TokenLegacyDto {
  access_token: string;
}

export interface ValidationErrorLegacyDto {
  loc: Array<string | number>;
  msg: string;
  type: string;
}
