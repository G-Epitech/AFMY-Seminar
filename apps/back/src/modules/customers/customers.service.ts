import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import {
  Clothe,
  Customer,
  CustomersFilters,
  Employee,
  Encounter,
  IdOf,
  Payment,
} from '@seminar/common';
import {
  Clothe as PrismaClothe,
  Customer as PrismaCustomer,
  Employee as PrismaEmployee,
  Encounter as PrismaEncounter,
  Payment as PrismaPayment,
} from '@prisma/client';
import {
  convertAstrologicalSign,
  convertAstrologicalSignToPrisma,
  convertClotheType,
  convertClotheTypeToPrisma,
  convertEmployee,
  convertEncounterStatus,
  convertEncounterStatusToPrisma,
  convertGender,
  convertGenderToPrisma,
  convertPaymentMethod,
  convertPaymentMethodToPrisma,
  convertPhotoFormat,
  convertPhotoFormatToPrisma,
} from '../../utils';
import {
  CreateCustomerCandidate,
  CreateCustomerClotheCandidate,
  CreateCustomerEncounterCandidate,
  CreateCustomerPaymentCandidate,
  UpdateCustomerCandidate,
  UpdateCustomerClotheCandidate,
  UpdateCustomerEncounterCandidate,
  UpdateCustomerPaymentCandidate,
} from '../../types/customers';
import { AuthEmployeeContext } from '../auth/auth.employee.context';

@Injectable()
export class CustomersService {
  @Inject(PrismaService)
  protected readonly _prismaService: PrismaService;

  @Inject(AuthEmployeeContext)
  protected readonly _authEmployeeContext: AuthEmployeeContext;

  async getCustomersCount(filters?: CustomersFilters): Promise<number> {
    return this._prismaService.customer.count({
      where: {
        birthDate: {
          gte: filters?.age
            ? new Date(new Date().getFullYear() - filters.age, 0)
            : undefined,
        },
        email: {
          contains: filters?.email,
        },
        name: {
          contains: filters?.name,
        },
        surname: {
          contains: filters?.name,
        },
        sign: filters?.astrologicalSign
          ? convertAstrologicalSignToPrisma(filters.astrologicalSign)
          : undefined,
        gender: filters?.gender
          ? convertGenderToPrisma(filters.gender)
          : undefined,
      },
    });
  }

  async getCustomers(
    filters?: CustomersFilters,
    limit?: number,
    skip?: number,
  ): Promise<Customer[]> {
    return this._prismaService.customer
      .findMany({
        where: {
          birthDate: {
            gte: filters?.age
              ? new Date(new Date().getFullYear() - filters.age, 0)
              : undefined,
          },
          email: {
            contains: filters?.email,
          },
          name: {
            contains: filters?.name,
          },
          surname: {
            contains: filters?.name,
          },
          sign: filters?.astrologicalSign
            ? convertAstrologicalSignToPrisma(filters.astrologicalSign)
            : undefined,
          gender: filters?.gender
            ? convertGenderToPrisma(filters.gender)
            : undefined,
        },
        take: limit,
        skip,
      })
      .then((customers) =>
        customers.map(
          (customer: PrismaCustomer): Customer => ({
            ...customer,
            gender: convertGender(customer.gender),
            sign: convertAstrologicalSign(customer.sign),
            photoFormat: customer.photoFormat
              ? convertPhotoFormat(customer.photoFormat)
              : null,
          }),
        ),
      );
  }

  async getCustomerById(id: IdOf<Customer>): Promise<Customer | null> {
    return this._prismaService.customer
      .findUnique({
        where: {
          id,
        },
      })
      .then((customer: PrismaCustomer) => {
        if (!customer) return null;

        return {
          ...customer,
          gender: convertGender(customer.gender),
          sign: convertAstrologicalSign(customer.sign),
          photoFormat: customer.photoFormat
            ? convertPhotoFormat(customer.photoFormat)
            : null,
        };
      });
  }

  async doesCustomerExist(id: IdOf<Customer>): Promise<boolean> {
    return this._prismaService.customer
      .findUnique({
        where: {
          id,
        },
      })
      .then((customer: PrismaCustomer | null) => {
        return !!customer;
      });
  }

  async createCustomer(
    customer: CreateCustomerCandidate,
  ): Promise<Customer | undefined> {
    return this._prismaService.customer
      .create({
        data: {
          ...customer,
          gender: convertGenderToPrisma(customer.gender),
          sign: convertAstrologicalSignToPrisma(customer.sign),
          coachId: customer.coachId,
          photoFormat: customer.photoFormat
            ? convertPhotoFormatToPrisma(customer.photoFormat)
            : null,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          return undefined;
        }
      })
      .then((customer?: PrismaCustomer) => {
        if (!customer) return undefined;

        return {
          ...customer,
          gender: convertGender(customer.gender),
          sign: convertAstrologicalSign(customer.sign),
          photoFormat: customer.photoFormat
            ? convertPhotoFormat(customer.photoFormat)
            : null,
        };
      });
  }

  async updateCustomer(
    id: IdOf<Customer>,
    customer: UpdateCustomerCandidate,
  ): Promise<Customer | null> {
    // If gender or sign are provided, convert them to Prisma types
    let data: Partial<PrismaCustomer> = {};

    const { sign, gender, photoFormat, ...rest } = customer;

    if (gender) {
      data.gender = convertGenderToPrisma(gender);
    }

    if (sign) {
      data.sign = convertAstrologicalSignToPrisma(sign);
    }

    if (photoFormat) {
      data.photoFormat = convertPhotoFormatToPrisma(photoFormat);
    }

    data = {
      ...data,
      ...rest,
    };

    return this._prismaService.customer
      .update({
        where: {
          id,
        },
        data,
      })
      .then((customer: PrismaCustomer | null) => {
        if (!customer) return null;

        return {
          ...customer,
          gender: convertGender(customer.gender),
          sign: convertAstrologicalSign(customer.sign),
          photoFormat: customer.photoFormat
            ? convertPhotoFormat(customer.photoFormat)
            : null,
        };
      });
  }

  async deleteCustomer(id: IdOf<Customer>): Promise<Customer | null> {
    return this._prismaService.customer
      .delete({
        where: {
          id,
        },
      })
      .then((customer: PrismaCustomer | null) => {
        if (!customer) return null;

        return {
          ...customer,
          gender: convertGender(customer.gender),
          sign: convertAstrologicalSign(customer.sign),
          photoFormat: customer.photoFormat
            ? convertPhotoFormat(customer.photoFormat)
            : null,
        };
      });
  }

  async getCustomerCoach(id: IdOf<Customer>): Promise<Employee | null> {
    return this._prismaService.customer
      .findUnique({
        where: {
          id,
        },
        include: {
          coach: true,
        },
      })
      .then((customer: PrismaCustomer & { coach: PrismaEmployee }) => {
        if (!customer) return null;

        return convertEmployee(customer.coach);
      });
  }

  async getCustomerEncounters(
    id: IdOf<Customer>,
    limit?: number,
    skip?: number,
  ): Promise<Encounter[]> {
    return this._prismaService.encounter
      .findMany({
        where: {
          customerId: id,
        },
        take: limit,
        skip,
      })
      .then((encounters) =>
        encounters.map(
          (encounter: PrismaEncounter): Encounter => ({
            ...encounter,
            status: convertEncounterStatus(encounter.status),
          }),
        ),
      );
  }

  async getCustomerPayments(
    id: IdOf<Customer>,
    limit?: number,
    skip?: number,
  ): Promise<Payment[]> {
    return this._prismaService.payment
      .findMany({
        where: {
          customerId: id,
        },
        take: limit,
        skip,
      })
      .then((payments: PrismaPayment[]) =>
        payments.map((payment: PrismaPayment): Payment => {
          return {
            ...payment,
            legacyId: payment.legacyId ? payment.legacyId : undefined,
            method: convertPaymentMethod(payment.method),
          };
        }),
      );
  }

  async getCustomerPaymentsCount(id: IdOf<Customer>): Promise<number> {
    return this._prismaService.payment.count({
      where: {
        customerId: id,
      },
    });
  }

  async getCustomerPayment(paymentId: number): Promise<Payment | null> {
    return this._prismaService.payment
      .findUnique({
        where: {
          id: paymentId,
        },
      })
      .then((payment: PrismaPayment | null) => {
        if (!payment) return null;

        return {
          ...payment,
          legacyId: payment.legacyId ? payment.legacyId : undefined,
          method: convertPaymentMethod(payment.method),
        };
      });
  }

  async getCustomerEncounter(encounterId: number): Promise<Encounter | null> {
    return this._prismaService.encounter
      .findUnique({
        where: {
          id: encounterId,
        },
      })
      .then((encounter: PrismaEncounter | null) => {
        if (!encounter) return null;

        return {
          ...encounter,
          status: convertEncounterStatus(encounter.status),
        };
      });
  }

  async updateCustomerEncounter(
    id: IdOf<Encounter>,
    candidate: UpdateCustomerEncounterCandidate,
  ): Promise<Encounter | null> {
    let mapped: Partial<PrismaEncounter> = {};

    const { status, ...rest } = candidate;

    if (status !== undefined) {
      mapped.status = convertEncounterStatusToPrisma(status);
    }

    mapped = {
      ...mapped,
      ...rest,
    };

    return this._prismaService.encounter
      .update({
        where: {
          id,
        },
        data: mapped,
      })
      .then((encounter: PrismaEncounter | null) => {
        if (!encounter) return null;

        return {
          ...encounter,
          status: convertEncounterStatus(encounter.status),
        };
      });
  }

  async deleteCustomerEncounter(
    id: IdOf<Encounter>,
  ): Promise<Encounter | null> {
    return this._prismaService.encounter
      .delete({
        where: {
          id,
        },
      })
      .then((encounter: PrismaEncounter | null) => {
        if (!encounter) return null;

        return {
          ...encounter,
          status: convertEncounterStatus(encounter.status),
        };
      });
  }

  async updateCustomerCoach(
    id: IdOf<Customer>,
    coachId: IdOf<Employee>,
  ): Promise<Employee | null> {
    return this._prismaService.customer
      .update({
        where: {
          id,
        },
        data: {
          coachId,
        },
        include: {
          coach: true,
        },
      })
      .then((customer: PrismaCustomer & { coach: PrismaEmployee }) => {
        if (!customer) return null;

        return convertEmployee(customer.coach);
      });
  }

  async updateCustomerPayment(
    id: IdOf<Payment>,
    candidate: UpdateCustomerPaymentCandidate,
  ): Promise<Payment | null> {
    let mapped: Partial<PrismaPayment> = {};

    const { method, ...rest } = candidate;

    if (method !== undefined) {
      mapped.method = convertPaymentMethodToPrisma(method);
    }

    mapped = {
      ...mapped,
      ...rest,
    };

    return this._prismaService.payment
      .update({
        where: {
          id,
        },
        data: mapped,
      })
      .then((payment: PrismaPayment | null) => {
        if (!payment) return null;

        return {
          ...payment,
          legacyId: payment.legacyId ? payment.legacyId : undefined,
          method: convertPaymentMethod(payment.method),
        };
      });
  }

  async deleteCustomerPayment(id: IdOf<Payment>): Promise<Payment | null> {
    return this._prismaService.payment
      .delete({
        where: {
          id,
        },
      })
      .then((payment: PrismaPayment | null) => {
        if (!payment) return null;

        return {
          ...payment,
          legacyId: payment.legacyId ? payment.legacyId : undefined,
          method: convertPaymentMethod(payment.method),
        };
      });
  }

  async createCustomerPayment(
    id: IdOf<Customer>,
    payment: CreateCustomerPaymentCandidate,
  ): Promise<Payment | undefined> {
    return this._prismaService.payment
      .create({
        data: {
          ...payment,
          method: convertPaymentMethodToPrisma(payment.method),
          customerId: id,
        },
      })
      .catch(() => {
        return undefined;
      })
      .then((payment?: PrismaPayment) => {
        if (!payment) return undefined;

        return {
          ...payment,
          legacyId: payment.legacyId ? payment.legacyId : undefined,
          method: convertPaymentMethod(payment.method),
        };
      });
  }

  async doesPaymentExist(id: IdOf<Payment>): Promise<boolean> {
    return this._prismaService.payment
      .findUnique({
        where: {
          id,
        },
      })
      .then((payment: PrismaPayment | null) => {
        return !!payment;
      });
  }

  async getCustomerEncountersCount(id: IdOf<Customer>): Promise<number> {
    return this._prismaService.encounter.count({
      where: {
        customerId: id,
      },
    });
  }

  async doesEncounterExist(id: IdOf<Encounter>): Promise<boolean> {
    return this._prismaService.encounter
      .findUnique({
        where: {
          id,
        },
      })
      .then((encounter: PrismaEncounter | null) => {
        return !!encounter;
      });
  }

  async doesCustomerHasEncounter(
    id: IdOf<Customer>,
    encounterId: IdOf<Encounter>,
  ): Promise<boolean> {
    return this._prismaService.encounter
      .findUnique({
        where: {
          id: encounterId,
        },
      })
      .then((encounter: PrismaEncounter | null) => {
        return encounter?.customerId === id;
      });
  }

  async doesCustomerHasPayment(
    id: IdOf<Customer>,
    paymentId: IdOf<Payment>,
  ): Promise<boolean> {
    return this._prismaService.payment
      .findUnique({
        where: {
          id: paymentId,
        },
      })
      .then((payment: PrismaPayment | null) => {
        return payment?.customerId === id;
      });
  }

  async createCustomerEncounter(
    id: IdOf<Customer>,
    encounter: CreateCustomerEncounterCandidate,
  ): Promise<Encounter | undefined> {
    return this._prismaService.encounter
      .create({
        data: {
          ...encounter,
          status: convertEncounterStatusToPrisma(encounter.status),
          customerId: id,
        },
      })
      .catch(() => {
        return undefined;
      })
      .then((encounter?: PrismaEncounter) => {
        if (!encounter) return undefined;

        return {
          ...encounter,
          status: convertEncounterStatus(encounter.status),
        };
      });
  }

  async getCustomerClothes(
    id: IdOf<Customer>,
    limit?: number,
    skip?: number,
  ): Promise<Clothe[] | null> {
    return this._prismaService.customer
      .findUnique({
        where: {
          id,
        },
        include: {
          clothes: {
            take: limit,
            skip,
          },
        },
      })
      .then((customer: PrismaCustomer & { clothes: PrismaClothe[] }) => {
        if (!customer) return null;

        return customer.clothes.map(
          (clothe: PrismaClothe): Clothe => ({
            ...clothe,
            type: convertClotheType(clothe.type),
          }),
        );
      });
  }

  async deleteCustomerClothe(
    id: IdOf<Customer>,
    clotheId: IdOf<Clothe>,
  ): Promise<Clothe | null> {
    return this._prismaService.customer
      .update({
        where: {
          id,
        },
        data: {
          clothes: {
            disconnect: {
              id: clotheId,
            },
          },
        },
        include: {
          clothes: {
            where: {
              id: clotheId,
            },
          },
        },
      })
      .then((customer: PrismaCustomer & { clothes: PrismaClothe[] }) => {
        if (customer.clothes.length === 0) return null;

        // If the clothes is connected to no other customer, delete it
        const clothe = this._prismaService.clothe.findUnique({
          where: {
            id: clotheId,
          },
          include: {
            customers: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!clothe) return null;

        if (clothe.customers.length === 0) {
          this._prismaService.clothe.delete({
            where: {
              id: clotheId,
            },
          });
        }

        return {
          ...customer.clothes[0],
          type: convertClotheType(customer.clothes[0].type),
        };
      });
  }

  async createCustomerClothe(
    id: IdOf<Customer>,
    clothe: CreateCustomerClotheCandidate,
  ): Promise<Clothe | undefined> {
    return this._prismaService.clothe
      .create({
        data: {
          ...clothe,
          type: convertClotheTypeToPrisma(clothe.type),
        },
      })
      .catch(() => {
        return undefined;
      })
      .then((clothe?: PrismaClothe) => {
        if (!clothe) return undefined;

        const customer = this._prismaService.customer.update({
          where: {
            id,
          },
          data: {
            clothes: {
              connect: {
                id: clothe.id,
              },
            },
          },
        });

        if (!customer) {
          this._prismaService.clothe.delete({
            where: {
              id: clothe.id,
            },
          });

          return undefined;
        }

        return {
          ...clothe,
          type: convertClotheType(clothe.type),
        };
      });
  }

  async doesClotheExist(id: IdOf<Clothe>): Promise<boolean> {
    return this._prismaService.clothe
      .findUnique({
        where: {
          id,
        },
      })
      .then((clothe: PrismaClothe | null) => {
        return !!clothe;
      });
  }

  async doesCustomerHasClothe(
    id: IdOf<Customer>,
    clotheId: IdOf<Clothe>,
  ): Promise<boolean> {
    return this._prismaService.customer
      .findUnique({
        where: {
          id,
        },
        include: {
          clothes: {
            where: {
              id: clotheId,
            },
          },
        },
      })
      .then((customer: PrismaCustomer & { clothes: PrismaClothe[] }) => {
        return customer.clothes.length > 0;
      });
  }

  async getCustomerClotheCount(id: IdOf<Customer>): Promise<number> {
    return this._prismaService.clothe.count({
      where: {
        customers: {
          some: {
            id,
          },
        },
      },
    });
  }

  async updateCustomerClothe(
    id: IdOf<Clothe>,
    clothe: UpdateCustomerClotheCandidate,
  ): Promise<Clothe | null> {
    let data: Partial<PrismaClothe> = {};

    const { type, ...rest } = clothe;

    if (type) {
      data.type = convertClotheTypeToPrisma(type);
    }

    data = {
      ...data,
      ...rest,
    };

    return this._prismaService.clothe
      .update({
        where: {
          id,
        },
        data,
      })
      .then((clothe: PrismaClothe | null) => {
        if (!clothe) return null;

        return {
          ...clothe,
          type: convertClotheType(clothe.type),
        };
      });
  }
}
