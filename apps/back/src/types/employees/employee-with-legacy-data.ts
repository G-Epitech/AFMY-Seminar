import { Employee } from '@seminar/common';

export interface EmployeeWithLegacyData extends Employee {
  legacyToken: string | null;
}
