import { Response, ResponseErrors } from '@seminar/common';

export class OK<T = any> implements Response<T> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: ResponseErrors;

  constructor(data?: T, errors?: ResponseErrors) {
    this.statusCode = 200;
    this.message = 'OK';
    this.errors = errors;
    this.data = data;
  }
}
