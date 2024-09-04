import { Employee } from '@seminar/common';
import { Credentials } from '@prisma/client';

export type EmployeeWithCredentials = Employee & {
  credentials?: Credentials;
};
