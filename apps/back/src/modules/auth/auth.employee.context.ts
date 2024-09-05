import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { EmployeeWithLegacyData } from '../../types/employees';

@Injectable({ scope: Scope.REQUEST })
export class AuthEmployeeContext {
  private _employee: EmployeeWithLegacyData | undefined = undefined;

  public set employee(employee: EmployeeWithLegacyData | undefined) {
    this._employee = employee;
  }

  public get employee(): EmployeeWithLegacyData {
    if (!this._employee) {
      throw new InternalServerErrorException('Employee not authenticated');
    }
    return this._employee;
  }

  get authenticated(): boolean {
    return !!this._employee;
  }

  get isLegacyAuthenticated(): boolean {
    return !!(this._employee && this._employee.legacyToken);
  }
}
