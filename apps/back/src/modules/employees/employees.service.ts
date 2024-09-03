import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { Employee, Gender } from '@seminar/common';

@Injectable()
export class EmployeesService {
  @Inject(PrismaService)
  private readonly _prismaService: PrismaService;

  async registerEmployee(employee: Employee, password: string) {
    const hashedPassword = password;

    return this._prismaService.employee.create({
      data: {
        ...employee,
        gender: Gender,
        credentials: {
          create: {
            email: employee.email,
            password: hashedPassword,
          },
        },
      },
    });
  }
}
