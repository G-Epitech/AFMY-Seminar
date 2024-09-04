import { Gender } from './customer.type';

export enum Permission {
  MANAGER,
  COACH,
}

export type Employee = {
  id: number;
  legacyId: number | null;
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
  numberOfCustomers?: number;
}
