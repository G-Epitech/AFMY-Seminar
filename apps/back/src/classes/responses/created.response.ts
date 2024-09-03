import { Response, ResponseErrors } from '@seminar/common';

export class Created<T> implements Response {
  statusCode: number;
  message: string;
  data?: T;
  errors?: ResponseErrors;

  constructor(data?: T, errors?: ResponseErrors) {
    this.statusCode = 201;
    this.message = 'Created';
    this.errors = errors;
    this.data = data;
  }
}
