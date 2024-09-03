import { BadRequestException } from '@nestjs/common';
import { Response, ResponseErrors } from '@seminar/common';

export class BadRequest<T = any> extends BadRequestException {
  constructor({
    errors = undefined,
    data = undefined,
    message = 'Bad Request',
  }: Partial<{
    errors?: ResponseErrors;
    data?: T;
    message?: string;
  }> = {}) {
    const res: Response = {
      statusCode: 400,
      message,
      errors,
      data,
    };

    super(res);
  }
}
