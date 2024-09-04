import { Employee } from '@seminar/common';

export type CreateEmployeeCandidate = Omit<Employee, 'id'>;
