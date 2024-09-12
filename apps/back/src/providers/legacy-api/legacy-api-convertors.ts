import { LegacyApiGender } from '../../types/legacy-api/gender.type';
import { ClotheType, Gender, PaymentMethod } from '@seminar/common';
import { LegacyApiClotheType } from '../../types/legacy-api/clothe-type.type';
import { LegacyApiPaymentMethod } from '../../types/legacy-api/payment-method.type';

export function legacyApiConvertGender(gender: LegacyApiGender): Gender {
  switch (gender) {
    case 'Female':
      return Gender.FE;
    case 'Male':
      return Gender.MA;
    default:
      return Gender.OT;
  }
}

export function legacyApiConvertClotheType(
  clotheType: LegacyApiClotheType,
): ClotheType {
  switch (clotheType) {
    case 'hat/cap':
      return ClotheType.HAT_CAP;
    case 'bottom':
      return ClotheType.BOTTOM;
    case 'top':
      return ClotheType.TOP;
    case 'shoes':
      return ClotheType.SHOES;
  }
}

export function legacyApiConvertPaymentMethod(
  paymentMethod: LegacyApiPaymentMethod,
): PaymentMethod {
  switch (paymentMethod) {
    case 'PayPal':
      return PaymentMethod.PAYPAL;
    case 'Bank Transfer':
      return PaymentMethod.BANK_TRANSFER;
    case 'Credit Card':
      return PaymentMethod.CREDIT_CARD;
  }
}
