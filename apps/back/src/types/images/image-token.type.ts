export enum ImageTokenType {
  CLOTHE = 'clothe',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
}

export type ImageTokenPayload = {
  type: ImageTokenType;
  id: number;
};
