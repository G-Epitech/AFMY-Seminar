import { Customer } from '../../types';
import { IdOf } from '../../utils';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class InGetEmployeePhotoDTO {
}

export class ParamGetEmployeePhotoDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}
