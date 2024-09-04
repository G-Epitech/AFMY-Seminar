import {
  HTTPErrorLegacyDto,
  ValidationErrorLegacyDto,
} from '../../types/legacy-api/dtos';
import { HttpStatus } from '@nestjs/common';

export class LegacyApiError extends Error {
  status: HttpStatus;
  details: HTTPErrorLegacyDto | ValidationErrorLegacyDto;

  constructor(
    message: string,
    status: HttpStatus,
    details: HTTPErrorLegacyDto | ValidationErrorLegacyDto,
  ) {
    super(message);
    this.details = details;
    this.status = status;
  }
}
