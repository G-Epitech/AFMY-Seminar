import { Customer } from './customer.type';
import { IdOf } from '../utils';

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
