import { LegacyApiGender } from '../../types/legacy-api/gender.type';
import { ClotheType, Gender } from '@seminar/common';
import { LegacyApiClotheType } from '../../types/legacy-api/clothe-type.type';

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
