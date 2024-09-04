import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import {
  CreateEmployeeCandidate,
  EmployeeWithCredentials,
} from '../../types/employees';
import bcrypt from 'bcrypt';
import { FieldsError } from '../../classes/errors/fields.error';
import { ALREADY_USED, Employee } from '@seminar/common';
import {
  convertEmployee,
  convertGenderToPrisma,
  convertPermissionToPrisma,
} from '../../utils';

@Injectable()
export class EmployeesService {
  @Inject(PrismaService)
  private readonly _prismaService: PrismaService;

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async preventDuplicatedFields(fields: {
    email: string;
    legacyId: number | null;
  }) {
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

  async getEmployeeByEmail(email: string) {
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

  async migrateEmployeeData(employee: Employee, token: string) {
    console.log('Migration of ', employee, token);
  }
}
