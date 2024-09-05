import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { OutGetMeDto, ParamGetEmployeePhotoDTO } from '@seminar/common';
import { Response } from 'express';
import fetch from 'node-fetch';

@Controller('employees')
export class EmployeesController {
  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

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
      photo: '/employees/' + me.id + '/photo',
      photoFormat: me.photoFormat,
    };
  }

  @Get(':id/photo')
  async getEmployeePhoto(
    @Res() res: Response,
    @Param() { id }: ParamGetEmployeePhotoDTO,
  ): Promise<Response | string> {
    const employee = await this._employeesService.getEmployeeById(id);

    if (employee === null) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    if (!employee.photo || !employee.photoFormat) {
      const avatar = await fetch(
        'https://ui-avatars.com/api/?background=random&name=' +
          employee.name +
          '+' +
          employee.surname,
      );
      const buffer = await avatar.buffer();
      return res.set('Content-Type', 'image/png').send(buffer);
    }

    return res
      .set('Content-Type', 'image/' + employee.photoFormat)
      .send(Buffer.from(employee.photo, 'base64'));
  }
}
