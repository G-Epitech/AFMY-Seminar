import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  Customer,
  InDeleteCustomerClotheDTO,
  InDeleteCustomerDTO,
  InDeleteCustomerEncounterDTO,
  InDeleteCustomerPaymentDTO,
  InGetCustomerCompatibilityDTO,
  InGetCustomerDTO,
  InGetCustomerEncountersDTO,
  InGetCustomerPaymentsDTO,
  InGetCustomersDTO,
  InPatchCustomerClotheDTO,
  InPatchCustomerDTO,
  InPatchCustomerEncounterDTO,
  InPatchCustomerPaymentDTO,
  InPostCreateCustomerClotheDTO,
  InPostCreateCustomerDTO,
  InPostCreateCustomerEncounterDTO,
  InPostCreateCustomerPaymentDTO,
  OutDeleteCustomerClotheDTO,
  OutDeleteCustomerDTO,
  OutDeleteCustomerEncounterDTO,
  OutDeleteCustomerPaymentDTO,
  OutGetCustomerClothesDTO,
  OutGetCustomerCompatibilityDTO,
  OutGetCustomerDTO,
  OutGetCustomerEncountersDTO,
  OutGetCustomerPaymentsDTO,
  OutGetCustomersDTO,
  OutPatchCustomerClotheDTO,
  OutPatchCustomerDTO,
  OutPatchCustomerEncounterDTO,
  OutPatchCustomerPaymentDTO,
  OutPostCreateCustomerClotheDTO,
  OutPostCreateCustomerDTO,
  OutPostCreateCustomerEncounterDTO,
  OutPostCreateCustomerPaymentDTO,
  ParamDeleteCustomerClotheDTO,
  ParamDeleteCustomerDTO,
  ParamDeleteCustomerEncounterDTO,
  ParamDeleteCustomerPaymentDTO,
  ParamGetCustomerCompatibilityDTO,
  ParamGetCustomerDTO,
  ParamGetCustomerEncountersDTO,
  ParamGetCustomerPaymentsDTO,
  ParamPatchCustomerClotheDTO,
  ParamPatchCustomerDTO,
  ParamPatchCustomerEncounterDTO,
  ParamPatchCustomerPaymentDTO,
  ParamPostCreateCustomerClotheDTO,
  ParamPostCreateCustomerEncounterDTO,
  ParamPostCreateCustomerPaymentDTO,
  PhotoFormat,
  QueryGetCustomerClothesDTO,
  QueryGetCustomerEncountersDTO,
  QueryGetCustomerPaymentsDTO,
  QueryGetCustomersDTO,
} from '@seminar/common';
import {
  CreateCustomerCandidate,
  UpdateCustomerCandidate,
} from '../../types/customers';
import { CustomersCompatibilityService } from './compatiblity.service';
import { PermissionsService } from '../permissions/permissions.service';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import { ImagesService } from '../images/images.service';
import { ImageTokenType } from '../../types/images';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customers')
export class CustomersController {
  @Inject(CustomersService)
  private readonly customersService: CustomersService;

  @Inject(CustomersCompatibilityService)
  private readonly customersCompatibilityService: CustomersCompatibilityService;

  @Inject(PermissionsService)
  private readonly permissionsService: PermissionsService;

  @Inject(AuthEmployeeContext)
  private readonly authEmployeeContext: AuthEmployeeContext;

  @Inject(ImagesService)
  private readonly imagesService: ImagesService;

  constructor() {}

  /**
   * Get customers paginated
   * ed. note: If you request page 500 and there are only 100 customers, you will get the last page with the remaining customers.
   * @param _ The body is ignored since GET requests don't have a body
   * @param page The page number
   * @param size The number of items per page (default 10)
   * @param filters Filters to apply to the query
   * @returns A page of customers
   */
  @Get()
  async getCustomers(
    @Body() _: InGetCustomersDTO,
    @Query() { page, size, ...filters }: QueryGetCustomersDTO,
  ): Promise<OutGetCustomersDTO> {
    if (!this.permissionsService.isManager())
      filters.coachId = this.authEmployeeContext.employee.id;

    const customerCount =
      await this.customersService.getCustomersCount(filters);

    const isLast = customerCount <= page * size + size;
    const startIndex = isLast ? Math.max(0, customerCount - size) : page * size;
    const items = (
      await this.customersService.getCustomers(filters, size, startIndex)
    ).map((customer: Customer): Customer => {
      return {
        ...customer,
        photo: this.imagesService.getLinkOf({
          id: customer.id,
          type: ImageTokenType.CUSTOMER,
        }),
        photoFormat: customer.photoFormat
          ? customer.photoFormat
          : PhotoFormat.PNG,
      };
    });

    return {
      index: page,
      size: items.length,
      isLast,
      items,
    };
  }

  @Get('count')
  async getCustomersCount(): Promise<number> {
    return await this.customersService.getCustomersCount();
  }

  @Get(':id')
  async getCustomer(
    @Body() _: InGetCustomerDTO,
    @Param() { id }: ParamGetCustomerDTO,
  ): Promise<OutGetCustomerDTO> {
    const customer = await this.customersService.getCustomerById(id);

    if (
      customer === null ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return {
      ...customer,
      photo: this.imagesService.getLinkOf({
        id: customer.id,
        type: ImageTokenType.CUSTOMER,
      }),
      photoFormat: customer.photoFormat
        ? customer.photoFormat
        : PhotoFormat.PNG,
    };
  }

  @Patch(':id')
  async updateCustomer(
    @Body() customer: InPatchCustomerDTO,
    @Param() { id }: ParamPatchCustomerDTO,
  ): Promise<OutPatchCustomerDTO> {
    const { birthDate, ...rest } = customer;

    const candidate: UpdateCustomerCandidate = {
      ...rest,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    };

    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const updated = await this.customersService.updateCustomer(id, candidate);

    if (!updated) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return {
      ...updated,
      photo: this.imagesService.getLinkOf({
        id: updated.id,
        type: ImageTokenType.CUSTOMER,
      }),
      photoFormat: updated.photoFormat ? updated.photoFormat : PhotoFormat.PNG,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createCustomer(
    @Body() customer: InPostCreateCustomerDTO,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<OutPostCreateCustomerDTO> {
    const candidate: CreateCustomerCandidate = {
      ...customer,
      birthDate: new Date(customer.birthDate),
      phone: customer.phone ? customer.phone : null,
      photo: photo ? this.imagesService.convertFileToBase64(photo) : null,
      address: customer.address ? customer.address : null,
      coachId: customer.coachId ? customer.coachId : null,
      photoFormat: customer.photoFormat ? customer.photoFormat : null,
      country: customer.country ? customer.country : null,
    };

    const created = await this.customersService.createCustomer(candidate);

    if (!created) {
      throw new ConflictException(
        `Customer with email '${customer.email}' already exists`,
      );
    }

    return {
      ...created,
      photo: this.imagesService.getLinkOf({
        id: created.id,
        type: ImageTokenType.CUSTOMER,
      }),
      photoFormat: created.photoFormat ? created.photoFormat : PhotoFormat.PNG,
    };
  }

  @Get(':id/payments')
  async getCustomerPayments(
    @Body() _: InGetCustomerPaymentsDTO,
    @Param() { id }: ParamGetCustomerPaymentsDTO,
    @Query() { page, size }: QueryGetCustomerPaymentsDTO,
  ): Promise<OutGetCustomerPaymentsDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const paymentCount =
      await this.customersService.getCustomerPaymentsCount(id);

    const isLast = paymentCount < page * size + size;
    const startIndex = isLast ? Math.max(0, paymentCount - size) : page * size;
    const items = await this.customersService.getCustomerPayments(
      id,
      size,
      startIndex,
    );

    return {
      index: page,
      size: items.length,
      isLast,
      items,
    };
  }

  @Post(':id/payments')
  async createPayment(
    @Param() { id }: ParamPostCreateCustomerPaymentDTO,
    @Body() body: InPostCreateCustomerPaymentDTO,
  ): Promise<OutPostCreateCustomerPaymentDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const payment = await this.customersService.createCustomerPayment(id, {
      ...body,
      customerId: id,
      comment: body.comment ? body.comment : null,
      date: new Date(body.date),
    });

    if (!payment) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return payment;
  }

  @Patch(':id/payments/:paymentId')
  async updatePayment(
    @Param() { id, paymentId }: ParamPatchCustomerPaymentDTO,
    @Body() body: InPatchCustomerPaymentDTO,
  ): Promise<OutPatchCustomerPaymentDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!(await this.customersService.doesPaymentExist(paymentId))) {
      throw new NotFoundException(`Payment with id ${paymentId} not found`);
    }

    if (!(await this.customersService.doesCustomerHasPayment(id, paymentId))) {
      throw new NotFoundException(
        `Customer with id ${id} does not have payment with id ${paymentId}`,
      );
    }

    const payment = await this.customersService.updateCustomerPayment(
      paymentId,
      {
        ...body,
        customerId: id,
        comment: body.comment ? body.comment : null,
        date: body.date ? new Date(body.date) : undefined,
      },
    );

    return payment!;
  }

  @Get(':id/encounters')
  async getCustomerEncounters(
    @Body() _: InGetCustomerEncountersDTO,
    @Param() { id }: ParamGetCustomerEncountersDTO,
    @Query() { page, size }: QueryGetCustomerEncountersDTO,
  ): Promise<OutGetCustomerEncountersDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const encounterCount =
      await this.customersService.getCustomerEncountersCount(id);

    const isLast = encounterCount < page * size + size;
    const startIndex = isLast
      ? Math.max(0, encounterCount - size)
      : page * size;
    const items = await this.customersService.getCustomerEncounters(
      id,
      size,
      startIndex,
    );

    return {
      index: page,
      size: items.length,
      isLast,
      items,
    };
  }

  @Patch(':id/encounters/:encounterId')
  async updateEncounter(
    @Param() { id, encounterId }: ParamPatchCustomerEncounterDTO,
    @Body() body: InPatchCustomerEncounterDTO,
  ): Promise<OutPatchCustomerEncounterDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!(await this.customersService.doesEncounterExist(encounterId))) {
      throw new NotFoundException(`Encounter with id ${encounterId} not found`);
    }

    if (
      !(await this.customersService.doesCustomerHasEncounter(id, encounterId))
    ) {
      throw new NotFoundException(
        `Customer with id ${id} does not have encounter with id ${encounterId}`,
      );
    }

    const encounter = await this.customersService.updateCustomerEncounter(
      encounterId,
      {
        ...body,
        customerId: id,
        comment: body.comment ? body.comment : null,
        date: body.date ? new Date(body.date) : undefined,
        isPositive: body.isPositive ? body.isPositive : null,
        rating: body.rating ? body.rating : null,
        source: body.source ? body.source : undefined,
        status: body.status ? body.status : undefined,
      },
    );

    return encounter!;
  }

  @Post(':id/encounters')
  async createEncounter(
    @Param() { id }: ParamPostCreateCustomerEncounterDTO,
    @Body() body: InPostCreateCustomerEncounterDTO,
  ): Promise<OutPostCreateCustomerEncounterDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const encounter = await this.customersService.createCustomerEncounter(id, {
      ...body,
      customerId: id,
      comment: body.comment ? body.comment : null,
      date: new Date(body.date),
      isPositive: body.isPositive ? body.isPositive : null,
      rating: body.rating ? body.rating : null,
      source: body.source,
      status: body.status,
    });

    if (!encounter) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return encounter;
  }

  @Delete(':id')
  async deleteCustomer(
    @Body() _: InDeleteCustomerDTO,
    @Param() { id }: ParamDeleteCustomerDTO,
  ): Promise<OutDeleteCustomerDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const deleted = await this.customersService.deleteCustomer(id);

    if (!deleted) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return {
      ...deleted,
      photo: '/customers/' + id + '/photo',
      photoFormat: deleted.photoFormat ? deleted.photoFormat : PhotoFormat.PNG,
    };
  }

  @Delete(':id/payments/:paymentId')
  async deletePayment(
    @Body() _: InDeleteCustomerPaymentDTO,
    @Param() { id, paymentId }: ParamDeleteCustomerPaymentDTO,
  ): Promise<OutDeleteCustomerPaymentDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!(await this.customersService.doesPaymentExist(paymentId))) {
      throw new NotFoundException(`Payment with id ${paymentId} not found`);
    }

    if (!(await this.customersService.doesCustomerHasPayment(id, paymentId))) {
      throw new NotFoundException(
        `Customer with id ${id} does not have payment with id ${paymentId}`,
      );
    }

    const payment =
      await this.customersService.deleteCustomerPayment(paymentId);

    return payment!;
  }

  @Delete(':id/encounters/:encounterId')
  async deleteEncounter(
    @Body() _: InDeleteCustomerEncounterDTO,
    @Param() { id, encounterId }: ParamDeleteCustomerEncounterDTO,
  ): Promise<OutDeleteCustomerEncounterDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!(await this.customersService.doesEncounterExist(encounterId))) {
      throw new NotFoundException(`Encounter with id ${encounterId} not found`);
    }

    if (
      !(await this.customersService.doesCustomerHasEncounter(id, encounterId))
    ) {
      throw new NotFoundException(
        `Customer with id ${id} does not have encounter with id ${encounterId}`,
      );
    }

    const encounter =
      await this.customersService.deleteCustomerEncounter(encounterId);

    return encounter!;
  }

  @Get(':id/clothes')
  async getCustomerClothes(
    @Param() { id }: ParamGetCustomerDTO,
    @Query() { page, size, type }: QueryGetCustomerClothesDTO,
  ): Promise<OutGetCustomerClothesDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const clothesCount =
      await this.customersService.getCustomerClothesCount(id);

    const isLast = clothesCount < page * size + size;
    const startIndex = isLast ? Math.max(0, clothesCount - size) : page * size;
    const items = await this.customersService.getCustomerClothes(id, {
      limit: size,
      skip: startIndex,
      filters: {
        type,
      },
    });

    if (items === null) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return {
      index: page,
      size: items.length,
      isLast,
      items,
    };
  }

  @Post(':id/clothes')
  async createCustomerClothe(
    @Param() { id }: ParamPostCreateCustomerClotheDTO,
    @Body() body: InPostCreateCustomerClotheDTO,
  ): Promise<OutPostCreateCustomerClotheDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const clothe = await this.customersService.createCustomerClothe(id, body);

    if (!clothe) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return clothe;
  }

  @Delete(':id/clothes/:clotheId')
  async deleteCustomerClothe(
    @Body() _: InDeleteCustomerClotheDTO,
    @Param() { id, clotheId }: ParamDeleteCustomerClotheDTO,
  ): Promise<OutDeleteCustomerClotheDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!(await this.customersService.doesClotheExist(clotheId))) {
      throw new NotFoundException(`Clothe with id ${clotheId} not found`);
    }

    if (!(await this.customersService.doesCustomerHasClothe(id, clotheId))) {
      throw new NotFoundException(
        `Customer with id ${id} does not have clothe with id ${clotheId}`,
      );
    }

    return (await this.customersService.deleteCustomerClothe(id, clotheId))!;
  }

  @Patch(':id/clothes/:clotheId')
  async updateClothe(
    @Param() { id, clotheId }: ParamPatchCustomerClotheDTO,
    @Body() body: InPatchCustomerClotheDTO,
  ): Promise<OutPatchCustomerClotheDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!(await this.customersService.doesClotheExist(clotheId))) {
      throw new NotFoundException(`Clothe with id ${clotheId} not found`);
    }

    if (!(await this.customersService.doesCustomerHasClothe(id, clotheId))) {
      throw new NotFoundException(
        `Customer with id ${id} does not have clothe with id ${clotheId}`,
      );
    }

    const clothe = await this.customersService.updateCustomerClothe(clotheId, {
      ...body,
      image: body.image,
      type: body.type,
    });

    return clothe!;
  }

  @Get(':id/compatibility/:otherId')
  async getCompatibility(
    @Body() _: InGetCustomerCompatibilityDTO,
    @Param() { id, otherId }: ParamGetCustomerCompatibilityDTO,
  ): Promise<OutGetCustomerCompatibilityDTO> {
    if (
      !(await this.customersService.doesCustomerExist(id)) ||
      !(await this.permissionsService.canCoachAccessCustomer(id))
    ) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (
      !(await this.customersService.doesCustomerExist(otherId)) ||
      !(await this.permissionsService.canCoachAccessCustomer(otherId))
    ) {
      throw new NotFoundException(`Customer with id ${otherId} not found`);
    }

    if (id === otherId) {
      throw new ConflictException('Cannot compare the same customer');
    }

    const res = await this.customersCompatibilityService.getFullCompatibility(
      id,
      otherId,
    );

    res.customerA.photo = '/customers/' + id + '/photo';
    res.customerB.photo = '/customers/' + otherId + '/photo';

    return res;
  }
}
