import { UnauthorizedException } from '@nestjs/common';
import { Response, ResponseErrors } from '@seminar/common';

export class Unauthorized<T = any> extends UnauthorizedException {
  constructor({
    errors = undefined,
    data = undefined,
    message = 'Unauthorized',
  }: Partial<{
    errors?: ResponseErrors;
    data?: T;
    message?: string;
  }> = {}) {
    const res: Response = {
      statusCode: 401,
      message,
      errors,
      data,
    };

    super(res);
  }
}
