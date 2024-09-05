import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import {
  CreateEmployeeCandidate,
  EmployeeWithCredentials,
} from '../../types/employees';
import * as bcrypt from 'bcrypt';
import { FieldsError } from '../../classes/errors/fields.error';
import { ALREADY_USED, Employee } from '@seminar/common';
import {
  convertEmployee,
  convertGenderToPrisma,
  convertPermissionToPrisma,
} from '../../utils';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import { InternalServerError } from '../../classes/responses';

@Injectable()
export class EmployeesService {
  @Inject(PrismaService)
  protected readonly _prismaService: PrismaService;

  @Inject(AuthEmployeeContext)
  protected readonly _authEmployeeContext: AuthEmployeeContext;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  public async getMe(): Promise<Employee> {
    const employee = await this._prismaService.employee.findUnique({
      where: {
        id: this._authEmployeeContext.employee.id,
      },
    });
    if (!employee) {
      throw new InternalServerError({
        message: 'Employee not found',
      });
    }
    return convertEmployee(employee);
  }

  private async preventDuplicatedFields(fields: {
    email: string;
    legacyId: number | null;
  }): Promise<void> {
    const result = await this._prismaService.employee.findFirst({
      where: {
        OR: [{ email: fields.email }, { legacyId: fields.legacyId }],
        AND: [{ legacyId: { not: null } }],
      },
    });

    if (result && result.email === fields.email) {
      throw new FieldsError({
        email: ALREADY_USED,
      });
    } else if (result) {
      throw new FieldsError({
        legacyId: ALREADY_USED,
      });
    }
  }

  async createEmployee(
    candidate: CreateEmployeeCandidate,
    password: string,
  ): Promise<Employee> {
    await this.preventDuplicatedFields({
      email: candidate.email,
      legacyId: candidate.legacyId,
    });

    const hashedPassword = await this.hashPassword(password);
    const employee = await this._prismaService.employee.create({
      data: {
        ...candidate,
        gender: convertGenderToPrisma(candidate.gender),
        permission: convertPermissionToPrisma(candidate.permission),
        photoFormat: null,
        credentials: {
          create: {
            email: candidate.email,
            password: hashedPassword,
          },
        },
      },
    });
    return convertEmployee(employee);
  }

  async getEmployeeByEmail(email: string): Promise<Employee | null> {
    const employee = await this._prismaService.employee.findFirst({
      where: {
        email,
      },
    });

    if (!employee) {
      return null;
    }
    return convertEmployee(employee);
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    const employee = await this._prismaService.employee.findFirst({
      where: {
        id,
      },
    });

    if (!employee) {
      return null;
    }
    return convertEmployee(employee);
  }

  async getEmployeeByEmailWithCredentials(
    email: string,
  ): Promise<EmployeeWithCredentials | null> {
    const employee = await this._prismaService.employee.findFirst({
      where: {
        email,
      },
      include: {
        credentials: true,
      },
    });

    if (!employee) {
      return null;
    }
    return {
      ...convertEmployee(employee),
      credentials: employee.credentials?.at(0),
    };
  }
}
