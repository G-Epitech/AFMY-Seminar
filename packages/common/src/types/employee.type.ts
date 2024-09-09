import { Gender, PhotoFormat } from "./customer.type";

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
  photoFormat: PhotoFormat | null;
  address: string | null;
  permission: Permission;
  role: string;
  numberOfCustomers?: number;
};

export type EmployeesFilters = {
  name?: string;
  email?: string;
  age?: number;
  gender?: Gender;
  role?: string;
  permission?: Permission;
  phone?: string;
};

export type EmployeesCountFilters = {
  age?: number;
  gender?: Gender;
  permission?: Permission;
}
