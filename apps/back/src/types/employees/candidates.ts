import { Employee } from '@seminar/common';

export type CreateEmployeeCandidate = Omit<Employee, 'id'>;

export type UpdateEmployeeCandidate = Partial<Omit<Employee, 'id'>>;
