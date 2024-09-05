import { Clothe, Customer, Encounter, Payment } from '@seminar/common';

export type UpdateCustomerCandidate = Partial<
  Omit<Customer, 'id' | 'createdAt' | 'coachId'>
>;

export type CreateCustomerCandidate = Omit<
  Customer,
  'id' | 'createdAt' | 'legacyId'
>;

export type UpdateCustomerEncounterCandidate = Partial<
  Omit<Encounter, 'id' | 'legacyId'>
>;

export type UpdateCustomerPaymentCandidate = Partial<
  Omit<Payment, 'id' | 'legacyId'>
>;

export type CreateCustomerPaymentCandidate = Omit<Payment, 'id' | 'legacyId'>;

export type CreateCustomerEncounterCandidate = Omit<
  Encounter,
  'id' | 'legacyId'
>;

export type CreateCustomerClotheCandidate = Omit<Clothe, 'id' | 'legacyId'>;

export type UpdateCustomerClotheCandidate = Partial<
  Omit<Clothe, 'id' | 'legacyId'>
>;
