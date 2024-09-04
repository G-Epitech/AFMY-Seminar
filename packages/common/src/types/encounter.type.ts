import { Customer } from './customer.type';
import { IdOf } from '../utils';

export enum EncounterStatus {
  PENDING = 'Pending',
  DONE = 'Done',
  CANCELED = 'Canceled'
}

export type Encounter = {
  id: number;
  legacyId: number | null;
  customerId: IdOf<Customer>;
  date: Date;
  rating: number | null;
  comment: string | null;
  source: string;
  status: EncounterStatus;
  isPositive: boolean | null;
}
