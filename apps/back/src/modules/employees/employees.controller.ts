import { Controller, Get, Inject } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { OutGetMeDto } from '@seminar/common';
import { ImagesService } from '../images/images.service';
import { ImageTokenType } from '../../types/images';

@Controller('employees')
export class EmployeesController {
  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

  @Inject(ImagesService)
  private readonly _imagesService: ImagesService;

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
}
