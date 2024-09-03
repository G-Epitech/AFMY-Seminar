export type ResponseErrors = { [key: string]: string | object };
export type Response<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
  errors?: ResponseErrors;
};
