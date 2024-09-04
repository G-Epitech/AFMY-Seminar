import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { Employee } from '@seminar/common';

@Injectable({ scope: Scope.REQUEST })
export class AuthEmployeeContext {
  private _employee: Employee | undefined = undefined;

  public set employee(employee: Employee | undefined) {
    this._employee = employee;
  }

  public get employee(): Employee {
    if (!this._employee) {
      throw new InternalServerErrorException('Employee not authenticated');
    }
    return this._employee;
  }

  get authenticated(): boolean {
    return !!this._employee;
  }
}
