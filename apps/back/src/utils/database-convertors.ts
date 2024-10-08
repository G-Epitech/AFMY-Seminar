import {
  AstrologicalSign as PrismaAstro,
  ClothesType as PrismaClotheType,
  Employee as PrismaEmployee,
  EncounterStatus as PrismaEncounterStatus,
  Gender as PrismaGender,
  PaymentMethod as PrismaPaymentMethod,
  Permission as PrismaPermission,
  PhotoFormat as PrismaPhotoFormat,
  Customer as PrismaCustomer,
} from '@prisma/client';
import {
  AstrologicalSign,
  ClotheType,
  Employee,
  EncounterStatus,
  Gender,
  PaymentMethod,
  Permission,
  PhotoFormat,
  Customer,
} from '@seminar/common';

export function convertGender(gender: PrismaGender): Gender {
  switch (gender) {
    case PrismaGender.FE:
      return Gender.FE;
    case PrismaGender.MA:
      return Gender.MA;
    case PrismaGender.OT:
      return Gender.OT;
  }
}

export function convertAstrologicalSign(sign: PrismaAstro): AstrologicalSign {
  switch (sign) {
    case 'AQUARIUS':
      return AstrologicalSign.AQUARIUS;
    case 'PISCES':
      return AstrologicalSign.PISCES;
    case 'ARIES':
      return AstrologicalSign.ARIES;
    case 'TAURUS':
      return AstrologicalSign.TAURUS;
    case 'GEMINI':
      return AstrologicalSign.GEMINI;
    case 'CANCER':
      return AstrologicalSign.CANCER;
    case 'LEO':
      return AstrologicalSign.LEO;
    case 'VIRGO':
      return AstrologicalSign.VIRGO;
    case 'LIBRA':
      return AstrologicalSign.LIBRA;
    case 'SCORPIO':
      return AstrologicalSign.SCORPIO;
    case 'SAGITTARIUS':
      return AstrologicalSign.SAGITTARIUS;
    case 'CAPRICORN':
      return AstrologicalSign.CAPRICORN;
  }
}

export function convertPaymentMethod(
  method: PrismaPaymentMethod,
): PaymentMethod {
  switch (method) {
    case PrismaPaymentMethod.CARD:
      return PaymentMethod.CREDIT_CARD;
    case PrismaPaymentMethod.PAYPAL:
      return PaymentMethod.PAYPAL;
    case PrismaPaymentMethod.BANK_TRANSFER:
      return PaymentMethod.BANK_TRANSFER;
  }
}

export function convertEncounterStatus(
  status: PrismaEncounterStatus,
): EncounterStatus {
  switch (status) {
    case PrismaEncounterStatus.PENDING:
      return EncounterStatus.PENDING;
    case PrismaEncounterStatus.CANCELED:
      return EncounterStatus.CANCELED;
    case PrismaEncounterStatus.DONE:
      return EncounterStatus.DONE;
  }
}

export function convertClotheType(type: PrismaClotheType): ClotheType {
  switch (type) {
    case PrismaClotheType.TOP:
      return ClotheType.TOP;
    case PrismaClotheType.BOTTOM:
      return ClotheType.BOTTOM;
    case PrismaClotheType.HAT_CAP:
      return ClotheType.HAT_CAP;
    case PrismaClotheType.SHOES:
      return ClotheType.SHOES;
  }
}

export function convertGenderToPrisma(gender: Gender): PrismaGender {
  switch (gender) {
    case Gender.FE:
      return PrismaGender.FE;
    case Gender.MA:
      return PrismaGender.MA;
    case Gender.OT:
      return PrismaGender.OT;
  }
}

export function convertAstrologicalSignToPrisma(
  astro: AstrologicalSign,
): PrismaAstro {
  switch (astro) {
    case AstrologicalSign.AQUARIUS:
      return PrismaAstro.AQUARIUS;
    case AstrologicalSign.PISCES:
      return PrismaAstro.PISCES;
    case AstrologicalSign.ARIES:
      return PrismaAstro.ARIES;
    case AstrologicalSign.TAURUS:
      return PrismaAstro.TAURUS;
    case AstrologicalSign.GEMINI:
      return PrismaAstro.GEMINI;
    case AstrologicalSign.CANCER:
      return PrismaAstro.CANCER;
    case AstrologicalSign.LEO:
      return PrismaAstro.LEO;
    case AstrologicalSign.VIRGO:
      return PrismaAstro.VIRGO;
    case AstrologicalSign.LIBRA:
      return PrismaAstro.LIBRA;
    case AstrologicalSign.SCORPIO:
      return PrismaAstro.SCORPIO;
    case AstrologicalSign.SAGITTARIUS:
      return PrismaAstro.SAGITTARIUS;
    case AstrologicalSign.CAPRICORN:
      return PrismaAstro.CAPRICORN;
  }
}

export function convertPaymentMethodToPrisma(
  method: PaymentMethod,
): PrismaPaymentMethod {
  switch (method) {
    case PaymentMethod.CREDIT_CARD:
      return PrismaPaymentMethod.CARD;
    case PaymentMethod.PAYPAL:
      return PrismaPaymentMethod.PAYPAL;
    case PaymentMethod.BANK_TRANSFER:
      return PrismaPaymentMethod.BANK_TRANSFER;
  }
}

export function convertEncounterStatusToPrisma(
  status: EncounterStatus,
): PrismaEncounterStatus {
  switch (status) {
    case EncounterStatus.PENDING:
      return PrismaEncounterStatus.PENDING;
    case EncounterStatus.CANCELED:
      return PrismaEncounterStatus.CANCELED;
    case EncounterStatus.DONE:
      return PrismaEncounterStatus.DONE;
  }
}

export function convertClotheTypeToPrisma(type: ClotheType): PrismaClotheType {
  switch (type) {
    case ClotheType.TOP:
      return PrismaClotheType.TOP;
    case ClotheType.BOTTOM:
      return PrismaClotheType.BOTTOM;
    case ClotheType.HAT_CAP:
      return PrismaClotheType.HAT_CAP;
    case ClotheType.SHOES:
      return PrismaClotheType.SHOES;
  }
}

export function convertPermissionToPrisma(
  permission: Permission,
): PrismaPermission {
  switch (permission) {
    case Permission.MANAGER:
      return PrismaPermission.MANAGER;
    case Permission.COACH:
      return PrismaPermission.COACH;
  }
}

export function convertPermission(permission: PrismaPermission): Permission {
  switch (permission) {
    case PrismaPermission.MANAGER:
      return Permission.MANAGER;
    case PrismaPermission.COACH:
      return Permission.COACH;
  }
}

export function convertEmployee(employee: PrismaEmployee): Employee {
  return {
    ...employee,
    gender: convertGender(employee.gender),
    permission: convertPermission(employee.permission),
    photoFormat: employee.photoFormat
      ? convertPhotoFormat(employee.photoFormat)
      : null,
  };
}

export function convertPhotoFormat(
  photoFormat: PrismaPhotoFormat,
): PhotoFormat {
  switch (photoFormat) {
    case PrismaPhotoFormat.GIF:
      return PhotoFormat.GIF;
    case PrismaPhotoFormat.JPEG:
      return PhotoFormat.JPEG;
    case PrismaPhotoFormat.PNG:
      return PhotoFormat.PNG;
  }
}

export function convertPhotoFormatToPrisma(
  photoFormat: PhotoFormat,
): PrismaPhotoFormat {
  switch (photoFormat) {
    case PhotoFormat.GIF:
      return PrismaPhotoFormat.GIF;
    case PhotoFormat.JPEG:
      return PrismaPhotoFormat.JPEG;
    case PhotoFormat.PNG:
      return PrismaPhotoFormat.PNG;
  }
}

export function convertCustomer(customer: PrismaCustomer): Customer {
  return {
    ...customer,
    gender: convertGender(customer.gender),
    sign: convertAstrologicalSign(customer.sign),
    photoFormat: customer.photoFormat
      ? convertPhotoFormat(customer.photoFormat)
      : null,
  };
}
