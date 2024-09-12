import {
  BadRequestException,
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
import {
  Customer,
  OutGetMeDto,
  Permission,
  PhotoFormat,
  Page,
  QueryGetEmployeesCountDTO,
  ParamGetEmployeeDTO,
  OutGetEmployeeDTO,
  InGetEmployeeDTO,
  InPatchEmployeeDTO,
  ParamDeleteEmployeeDTO,
  OutDeleteEmployeeDTO,
  QueryGetEmployeesDTO,
  OutGetEmployeesDTO,
  QueryGetEmployeeCustomersDTO,
  ParamGetEmployeeCustomersDTO,
} from '@seminar/common';
import { ImagesService } from '../images/images.service';
import { ImageTokenType } from '../../types/images';
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
    const employeesCount =
      await this._employeesService.getEmployeesCount(filters);

    const pageIndex = Math.floor(employeesCount / size);
    const isLast = employeesCount <= page * size + size;
    const startIndex = pageIndex * size;
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

  @Get('count')
  async getEmployeesCount(
    @Query() filters: QueryGetEmployeesCountDTO,
  ): Promise<number> {
    return await this._employeesService.getEmployeesCount(filters);
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
      numberOfCustomers: employee.numberOfCustomers,
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

  @Get(':id/customers')
  async getEmployeeCustomers(
    @Param() { id }: ParamGetEmployeeCustomersDTO,
    @Query() { page, size }: QueryGetEmployeeCustomersDTO,
  ): Promise<Page<Customer>> {
    const employee = await this._employeesService.getEmployeeById(id);

    if (!employee || !this._permissionsService.canAccessEmployee(id)) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    if (employee.permission !== Permission.COACH) {
      throw new BadRequestException(`Employee with id ${id} is not a coach`);
    }
    const customersCount =
      await this._employeesService.getCoachCustomersCount(id);
    const customers = await this._employeesService.getCoachCustomers(
      id,
      size,
      page * size,
    );
    const isLast = customersCount <= page * size + customers.length;
    return {
      items: customers.map((customer) => ({
        ...customer,
        photo: this._imagesService.getLinkOf({
          id: customer.id,
          type: ImageTokenType.CUSTOMER,
        }),
        photoFormat: customer.photoFormat
          ? customer.photoFormat
          : PhotoFormat.PNG,
      })),
      isLast,
      size: customers.length,
      index: page,
    };
  }
}
