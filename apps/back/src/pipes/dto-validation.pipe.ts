import { ValidationError, ValidationPipe } from '@nestjs/common';
import {
  ResponseErrors,
  INVALID_EMAIL,
  MUST_BE_STRING,
  TOO_LONG,
  TOO_SHORT,
  EMPTY,
  INVALID_FIELD,
  INVALID_TYPE,
  REQUIRED,
  INVALID_NUMBER,
  INVALID_DATE,
} from '@seminar/common';
import { BadRequest } from '../classes/responses';

const defaultCodesMap = {
  default: INVALID_FIELD,
  required: REQUIRED,
  isEmail: INVALID_EMAIL,
  isString: MUST_BE_STRING,
  isNotEmpty: EMPTY,
  isInt: INVALID_NUMBER,
  minLength: TOO_SHORT,
  maxLength: TOO_LONG,
  isEnum: INVALID_TYPE,
  isDate: INVALID_DATE,
};

function getCodesMap(validator: ValidationError, constraint: string): object {
  return {
    ...defaultCodesMap,
    ...(validator.contexts?.[constraint] || {}),
  };
}

function getErrorCode(error: ValidationError): string {
  const constraint = Object.keys(error.constraints || {})[0];
  const codesMap = getCodesMap(error, constraint);

  if (error.value === undefined || error.value === null) {
    return codesMap['required'];
  }
  return codesMap[constraint] || codesMap['default'];
}

export class DtoValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const result: ResponseErrors = {};

        for (const error of errors) {
          result[error.property] = getErrorCode(error);
        }
        return new BadRequest({ errors: result });
      },
      whitelist: true,
    });
  }
}
