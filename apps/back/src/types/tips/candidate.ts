import { Tip } from '@seminar/common';

export type CreateTipCandidate = Omit<Tip, 'id'>;

export type UpdateTipCandidate = Partial<Omit<Tip, 'id'>>;
