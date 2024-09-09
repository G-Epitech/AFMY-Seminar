import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { OutGetMeDto, Permission, PhotoFormat } from '@seminar/common';
import { ImagesService } from '../images/images.service';
import { ImageTokenType } from '../../types/images';
import {
  ParamGetEmployeeDTO,
  OutGetEmployeeDTO,
  InGetEmployeeDTO,
  InPatchEmployeeDTO,
  ParamDeleteEmployeeDTO,
  OutDeleteEmployeeDTO,
  QueryGetEmployeesDTO,
  OutGetEmployeesDTO,
} from '@seminar/common';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateEmployeeCandidate } from '../../types/employees';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import { Allow } from './decorators/allow.decorator';

@Controller('employees')
export class EmployeesController {
  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

  @Inject(PermissionsService)
  private readonly _permissionsService: PermissionsService;

  @Inject(ImagesService)
  private readonly _imagesService: ImagesService;

  @Inject(AuthEmployeeContext)
  protected readonly _authEmployeeContext: AuthEmployeeContext;

  @Get('me')
  async getMe(): Promise<OutGetMeDto> {
    const me = await this._employeesService.getMe();
    return {
      id: me.id,
      legacyId: me.legacyId,
      email: me.email,
      name: me.name,
      surname: me.surname,
      birthDate: me.birthDate,
      gender: me.gender,
      phone: me.phone,
      address: me.address,
      permission: me.permission,
      role: me.role,
      numberOfCustomers: me.numberOfCustomers,
      photo: this._imagesService.getLinkOf({
        type: ImageTokenType.EMPLOYEE,
        id: me.id,
      }),
      photoFormat: me.photoFormat,
    };
  }

  @Get()
  async getEmployees(
    @Query() { size, page, ...filters }: QueryGetEmployeesDTO,
  ): Promise<OutGetEmployeesDTO> {
    const employeesCount = await this._employeesService.getEmployeesCount();
    const isLast = employeesCount < page * size + size;
    const startIndex = isLast
      ? Math.max(0, employeesCount - size)
      : page * size;
    const items = await this._employeesService.getEmployees(
      filters,
      size,
      startIndex,
    );

    return {
      index: page,
      size: items.length,
      isLast,
      items: items.map((employee) => ({
        ...employee,
        photo: this._imagesService.getLinkOf({
          id: employee.id,
          type: ImageTokenType.EMPLOYEE,
        }),
        photoFormat: employee.photoFormat
          ? employee.photoFormat
          : PhotoFormat.PNG,
      })),
    };
  }

  @Get(':id')
  async getEmployeeById(
    @Body() _: InGetEmployeeDTO,
    @Param() { id }: ParamGetEmployeeDTO,
  ): Promise<OutGetEmployeeDTO> {
    const employee = await this._employeesService.getEmployeeById(id);
    const found =
      employee && this._permissionsService.canAccessEmployee(employee);

    if (!found) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return {
      ...employee,
      photo: this._imagesService.getLinkOf({
        id: employee.id,
        type: ImageTokenType.EMPLOYEE,
      }),
      photoFormat: employee.photoFormat
        ? employee.photoFormat
        : PhotoFormat.PNG,
    };
  }

  @Patch(':id')
  async updateEmployee(
    @Body() employee: InPatchEmployeeDTO,
    @Param() { id }: ParamGetEmployeeDTO,
  ): Promise<OutGetEmployeeDTO> {
    const candidate: UpdateEmployeeCandidate = employee;
    const current = await this._employeesService.getEmployeeById(id);

    if (!current || !this._permissionsService.canAccessEmployee(id)) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (
      candidate.permission === Permission.MANAGER &&
      !this._permissionsService.isManager()
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to promote employee to manager',
      );
    }

    if (
      candidate.permission === Permission.COACH &&
      current.permission === Permission.MANAGER
    ) {
      throw new ForbiddenException('Manager cannot be demoted to coach');
    }

    const updated = await this._employeesService.updateEmployee(id, candidate);

    if (!updated) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return {
      ...updated,
      photo: this._imagesService.getLinkOf({
        id: updated.id,
        type: ImageTokenType.EMPLOYEE,
      }),
      photoFormat: updated.photoFormat ? updated.photoFormat : PhotoFormat.PNG,
    };
  }

  @Delete(':id')
  @Allow(Permission.MANAGER)
  async deleteEmployee(
    @Param() { id }: ParamDeleteEmployeeDTO,
  ): Promise<OutDeleteEmployeeDTO> {
    const employee = await this._employeesService.getEmployeeById(id);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    } else if (employee.id === this._authEmployeeContext.employee.id) {
      throw new ForbiddenException('Cannot delete yourself');
    } else if (employee.permission === Permission.MANAGER) {
      throw new ForbiddenException('Cannot delete manager');
    }

    await this._employeesService.deleteEmployeeById(id);
    return {
      deleted: true,
    };
  }
}
