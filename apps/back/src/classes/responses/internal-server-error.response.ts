import { InternalServerErrorException } from '@nestjs/common';
import { Response, ResponseErrors } from '@seminar/common';

export class InternalServerError<T = any> extends InternalServerErrorException {
  constructor({
    errors = undefined,
    data = undefined,
    message = 'Internal Server Error',
  }: Partial<{
    errors?: ResponseErrors;
    data?: T;
    message?: string;
  }> = {}) {
    const res: Response = {
      statusCode: 500,
      message,
      errors,
      data,
    };

    super(res);
  }
}
