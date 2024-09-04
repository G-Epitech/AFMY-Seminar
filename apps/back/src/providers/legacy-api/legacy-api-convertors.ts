import { LegacyApiGender } from '../../types/legacy-api/gender.type';
import { Gender } from '@seminar/common';

export function legacyApiConvertGender(gender: LegacyApiGender) {
  switch (gender) {
    case 'Female':
      return Gender.FE;
    case 'Male':
      return Gender.MA;
    default:
      return Gender.OT;
  }
}
