import { Inject, Injectable } from '@nestjs/common';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import {
  Gender,
  Permission,
  Employee as PrismaEmployee,
  PhotoFormat,
} from '@prisma/client';
import { legacyApiConvertGender } from '../../providers/legacy-api/legacy-api-convertors';
import { EmployeesService } from './employees.service';
import { convertEmployee } from '../../utils';
import { EmployeeWithCredentials } from '../../types/employees';
import { EmployeeLegacyDto } from '../../types/legacy-api/dtos';
import { Employee } from '@seminar/common';

@Injectable()
export class EmployeesMigrationService extends EmployeesService {
  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  constructor() {
    super();
  }

  private async getEmployeePhoto(
    token: string,
    employeeId: number,
  ): Promise<Buffer> {
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

  private async getTokenOwner(token: string): Promise<EmployeeLegacyDto> {
    const response = await this._legacyApiService.request(
      'GET /employees/me',
      {},
      token,
    );
    return response.data;
  }

  private async getLegacyEmployeeById(
    token: string,
    id: number,
  ): Promise<EmployeeLegacyDto | null> {
    try {
      const requests = await this._legacyApiService.request(
        'GET /employees/{employee_id}',
        {
          parameters: {
            employee_id: id,
          },
        },
        token,
      );
      return requests.data;
    } catch (error) {
      return null;
    }
  }

  private formatEmployeeData(
    legacyEmployee: EmployeeLegacyDto,
    photo?: Buffer,
  ): Omit<PrismaEmployee, 'id'> {
    return {
      email: legacyEmployee.email,
      legacyId: legacyEmployee.id,
      name: legacyEmployee.name,
      surname: legacyEmployee.surname,
      birthDate: new Date(legacyEmployee.birth_date),
      gender: legacyApiConvertGender(legacyEmployee.gender) as Gender,
      permission:
        legacyEmployee.work === 'Coach' ? Permission.COACH : Permission.MANAGER,
      role: legacyEmployee.work,
      photo: photo?.toString('base64') || null,
      photoFormat: PhotoFormat.PNG,
      phone: null,
      address: null,
    };
  }

  async importEmployeeWithCredentials(
    token: string,
    email: string,
    password: string,
  ): Promise<EmployeeWithCredentials | null> {
    try {
      const legacyEmployee = await this.getTokenOwner(token);
      const photo = await this.getEmployeePhoto(token, legacyEmployee.id);
      const employeeData = {
        ...this.formatEmployeeData(legacyEmployee, photo),
        credentials: {
          create: {
            email,
            password: await this.hashPassword(password),
          },
        },
      };
      const res = await this._prismaService.employee.upsert({
        where: {
          legacyId: legacyEmployee.id,
        },
        update: {
          email,
          credentials: employeeData.credentials,
        },
        create: employeeData,
        include: {
          credentials: true,
        },
      });
      const { credentials, ...employee } = res;
      return {
        ...convertEmployee(employee),
        credentials: credentials?.at(0),
      };
    } catch (error) {
      return null;
    }
  }

  async importEmployeeIfNotExists(
    token: string,
    id: number,
  ): Promise<Employee | null> {
    let employee = await this._prismaService.employee.findUnique({
      where: {
        legacyId: id,
      },
    });
    const legacyEmployee = !employee
      ? await this.getLegacyEmployeeById(token, id)
      : null;

    if (legacyEmployee) {
      const photo = await this.getEmployeePhoto(token, legacyEmployee.id);
      const employeeData = this.formatEmployeeData(legacyEmployee, photo);
      employee = await this._prismaService.employee.create({
        data: employeeData,
      });
    }
    return employee ? convertEmployee(employee) : null;
  }
}
