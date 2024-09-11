import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import {
  CreateEmployeeCandidate,
  EmployeeWithCredentials,
  UpdateEmployeeCandidate,
} from '../../types/employees';
import * as bcrypt from 'bcrypt';
import { FieldsError } from '../../classes/errors/fields.error';
import {
  ALREADY_USED,
  Employee,
  EmployeesCountFilters,
  EmployeesFilters,
} from '@seminar/common';
import {
  convertEmployee,
  convertGender,
  convertGenderToPrisma,
  convertPermission,
  convertPermissionToPrisma,
  convertPhotoFormat,
  convertPhotoFormatToPrisma,
} from '../../utils';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import { InternalServerError } from '../../classes/responses';
import { ImageTokenType } from '../../types/images';
import { ImagesService } from '../images/images.service';

@Injectable()
export class EmployeesService {
  @Inject(PrismaService)
  protected readonly _prismaService: PrismaService;

  @Inject(AuthEmployeeContext)
  protected readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(ImagesService)
  protected readonly _imagesService: ImagesService;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async doesEmployeeExists(id: number): Promise<boolean> {
    return this._prismaService.employee
      .findUnique({
        where: {
          id,
        },
      })
      .then((e) => !!e);
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

  async updateEmployee(
    id: number,
    candidate: UpdateEmployeeCandidate,
  ): Promise<Employee | null> {
    const employee = await this._prismaService.employee.update({
      where: {
        id,
      },
      data: {
        ...candidate,
        photoFormat: candidate.photoFormat
          ? convertPhotoFormatToPrisma(candidate.photoFormat)
          : undefined,
        gender: candidate.gender
          ? convertGenderToPrisma(candidate.gender)
          : undefined,
        permission: candidate.permission
          ? convertPermissionToPrisma(candidate.permission)
          : undefined,
      },
    });
    if (!employee) {
      return null;
    }
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

  async getEmployeeById(
    id: number,
    options: { numberOfCustomers?: boolean } = {},
  ): Promise<Employee | null> {
    const employee = await this._prismaService.employee.findFirst({
      where: {
        id,
      },
      include: {
        coachees: {
          select: {
            _count: true,
          },
        },
      },
    });

    if (!employee) {
      return null;
    }

    return {
      ...convertEmployee(employee),
      numberOfCustomers: employee.coachees?.length,
    };
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

  async deleteEmployeeById(id: number): Promise<Employee | null> {
    const employee = await this._prismaService.employee.delete({
      where: {
        id,
      },
    });

    if (!employee) {
      return null;
    }
    return convertEmployee(employee);
  }

  async getEmployees(
    filters?: EmployeesFilters,
    limit?: number,
    skip?: number,
  ): Promise<Employee[]> {
    return this._prismaService.employee
      .findMany({
        where: {
          OR: filters?.name
            ? [
                { name: { contains: filters.name, mode: 'insensitive' } },
                { surname: { contains: filters.name, mode: 'insensitive' } },
              ]
            : undefined,
          birthDate: {
            gte: filters?.age
              ? new Date(new Date().getFullYear() - filters.age, 0)
              : undefined,
            lte: filters?.age
              ? new Date(new Date().getFullYear() - filters.age + 1, 0)
              : undefined,
          },
          email: {
            contains: filters?.email,
            mode: 'insensitive',
          },
          gender: filters?.gender
            ? convertGenderToPrisma(filters.gender)
            : undefined,
          phone: {
            contains: filters?.phone,
            mode: 'insensitive',
          },
          role: {
            contains: filters?.role,
            mode: 'insensitive',
          },
          permission: {
            equals: filters?.permission
              ? convertPermissionToPrisma(filters.permission)
              : undefined,
          },
        },
        take: limit,
        skip,
      })
      .then((employees) =>
        employees.map(
          (employee): Employee => ({
            ...employee,
            gender: convertGender(employee.gender),
            photo: employee.photo
              ? this._imagesService.getLinkOf({
                  type: ImageTokenType.CUSTOMER,
                  id: employee.id,
                })
              : null,
            photoFormat: employee.photoFormat
              ? convertPhotoFormat(employee.photoFormat)
              : null,
            permission: convertPermission(employee.permission),
          }),
        ),
      );
  }

  async getEmployeesCount(filters?: EmployeesCountFilters): Promise<number> {
    return this._prismaService.employee.count({
      where: {
        OR: filters?.name
          ? [
              { name: { contains: filters.name, mode: 'insensitive' } },
              { surname: { contains: filters.name, mode: 'insensitive' } },
            ]
          : undefined,
        phone: {
          contains: filters?.phone,
          mode: 'insensitive',
        },
        birthDate: {
          gte: filters?.age
            ? new Date(new Date().getFullYear() - filters.age, 0)
            : undefined,
          lte: filters?.age
            ? new Date(new Date().getFullYear() - filters.age + 1, 0)
            : undefined,
        },
        email: {
          contains: filters?.email,
          mode: 'insensitive',
        },
        gender: filters?.gender
          ? convertGenderToPrisma(filters.gender)
          : undefined,
        permission: {
          equals: filters?.permission
            ? convertPermissionToPrisma(filters.permission)
            : undefined,
        },
      },
    });
  }
}
