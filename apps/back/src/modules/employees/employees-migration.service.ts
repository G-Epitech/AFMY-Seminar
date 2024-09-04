import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import { Gender, Permission } from '@prisma/client';
import { legacyApiConvertGender } from '../../providers/legacy-api/legacy-api-convertors';
import { EmployeesService } from './employees.service';
import { convertEmployee } from '../../utils';
import { EmployeeWithCredentials } from '../../types/employees';

@Injectable()
export class EmployeesMigrationService {
  @Inject(PrismaService)
  private readonly _prismaService: PrismaService;

  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

  private async getEmployeePhoto(token: string, employeeId: number) {
    const photo = await this._legacyApiService.request(
      'GET /employees/{employee_id}/image',
      {
        parameters: {
          employee_id: employeeId,
        },
      },
      token,
    );
    return photo.data;
  }

  private async getMe(token: string) {
    const requests = await this._legacyApiService.request(
      'GET /employees/me',
      {},
      token,
    );
    return requests.data;
  }

  async importEmployee(
    token: string,
    email: string,
    password: string,
  ): Promise<EmployeeWithCredentials | null> {
    try {
      const me = await this.getMe(token);
      const photo = await this.getEmployeePhoto(token, me.id);

      const employee = await this._prismaService.employee.create({
        data: {
          email,
          legacyId: me.id,
          name: me.name,
          surname: me.surname,
          birthDate: new Date(me.birth_date),
          gender: legacyApiConvertGender(me.gender) as Gender,
          permission:
            me.work === 'Coach' ? Permission.COACH : Permission.MANAGER,
          role: me.work,
          credentials: {
            create: {
              email,
              password: await this._employeesService.hashPassword(password),
            },
          },
          photo: photo.toString('base64'),
        },
      });

      // TODO: Call customers migration service

      return convertEmployee(employee);
    } catch (error) {
      return null;
    }
  }
}
