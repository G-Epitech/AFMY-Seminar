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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomersService } from './customers.service';
import {
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
  QueryGetCustomerClothesDTO,
  QueryGetCustomerEncountersDTO,
  QueryGetCustomerPaymentsDTO,
  QueryGetCustomersDTO,
} from '@seminar/common';
import {
  CreateCustomerCandidate,
  UpdateCustomerCandidate,
} from '../../types/customers';
import fetch from 'node-fetch';
import { CustomersCompatibilityService } from './compatiblity.service';
import { PermissionsService } from '../permissions/permissions.service';

@Controller('customers')
export class CustomersController {
  @Inject(CustomersService)
  private readonly customersService: CustomersService;

  @Inject(CustomersCompatibilityService)
  private readonly customersCompatibilityService: CustomersCompatibilityService;

  @Inject(PermissionsService)
  private readonly permissionsService: PermissionsService;

  constructor() {}

  /**
   * Get customers paginated
   * ed. note: If you request page 500 and there are only 100 customers, you will get the last page with the remaining customers.
   * @param _ The body is ignored since GET requests don't have a body
   * @param page The page number
   * @param size The number of items per page (default 10)
   * @returns A page of customers
   */
  @Get()
  async getCustomers(
    @Body() _: InGetCustomersDTO,
    @Query() { page, size }: QueryGetCustomersDTO,
  ): Promise<OutGetCustomersDTO> {
    const customerCount = await this.customersService.getCustomersCount();

    const isLast = customerCount < page * size + size;
    const startIndex = isLast ? Math.max(0, customerCount - size) : page * size;
    const items = await this.customersService.getCustomers(size, startIndex);

    return {
      index: page,
      size,
      isLast,
      items,
    };
  }

  @Get(':id')
  async getCustomer(
    @Body() _: InGetCustomerDTO,
    @Param() { id }: ParamGetCustomerDTO,
  ): Promise<OutGetCustomerDTO> {
    const customer = await this.customersService.getCustomerById(id);

    if (customer === null) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  @Get(':id/photo')
  async getCustomerPhoto(
    @Res() res: Response,
    @Param() { id }: ParamGetCustomerDTO,
  ): Promise<Response | string> {
    const customer = await this.customersService.getCustomerById(id);

    if (customer === null) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (!customer.photo || !customer.photoFormat) {
      const avatar = await fetch(
        'https://ui-avatars.com/api/?background=random&name=' +
          customer.name +
          '+' +
          customer.surname,
      );
      const buffer = await avatar.buffer();
      return res.set('Content-Type', 'image/png').send(buffer);
    }

    return res
      .set('Content-Type', 'image/' + customer.photoFormat)
      .send(Buffer.from(customer.photo, 'base64'));
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

    if (!(await this.customersService.doesCustomerExist(id))) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return (await this.customersService.updateCustomer(id, candidate))!;
  }

  @Post('create')
  async createCustomer(
    @Body() customer: InPostCreateCustomerDTO,
  ): Promise<OutPostCreateCustomerDTO> {
    const candidate: CreateCustomerCandidate = {
      ...customer,
      birthDate: new Date(customer.birthDate),
      phone: customer.phone ? customer.phone : null,
      photo: customer.photo ? customer.photo : null,
      address: customer.address ? customer.address : null,
      coachId: customer.coachId ? customer.coachId : null,
      photoFormat: customer.photoFormat ? customer.photoFormat : null,
    };

    const created = await this.customersService.createCustomer(candidate);

    if (!created) {
      throw new ConflictException(
        `Customer with email '${customer.email}' already exists`,
      );
    }

    return created;
  }

  @Get(':id/payments')
  async getCustomerPayments(
    @Body() _: InGetCustomerPaymentsDTO,
    @Param() { id }: ParamGetCustomerPaymentsDTO,
    @Query() { page, size }: QueryGetCustomerPaymentsDTO,
  ): Promise<OutGetCustomerPaymentsDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
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
      size,
      isLast,
      items,
    };
  }

  @Post(':id/payments/create')
  async createPayment(
    @Param() { id }: ParamPostCreateCustomerPaymentDTO,
    @Body() body: InPostCreateCustomerPaymentDTO,
  ): Promise<OutPostCreateCustomerPaymentDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    if (!(await this.customersService.doesCustomerExist(id))) {
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
      size,
      isLast,
      items,
    };
  }

  @Patch(':id/encounters/:encounterId')
  async updateEncounter(
    @Param() { id, encounterId }: ParamPatchCustomerEncounterDTO,
    @Body() body: InPatchCustomerEncounterDTO,
  ): Promise<OutPatchCustomerEncounterDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
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

  @Post(':id/encounters/create')
  async createEncounter(
    @Param() { id }: ParamPostCreateCustomerEncounterDTO,
    @Body() body: InPostCreateCustomerEncounterDTO,
  ): Promise<OutPostCreateCustomerEncounterDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    if (!(await this.customersService.doesCustomerExist(id))) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return (await this.customersService.deleteCustomer(id))!;
  }

  @Delete(':id/payments/:paymentId')
  async deletePayment(
    @Body() _: InDeleteCustomerPaymentDTO,
    @Param() { id, paymentId }: ParamDeleteCustomerPaymentDTO,
  ): Promise<OutDeleteCustomerPaymentDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    @Query() { page, size }: QueryGetCustomerClothesDTO,
  ): Promise<OutGetCustomerClothesDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const clothesCount = await this.customersService.getCustomerClotheCount(id);

    const isLast = clothesCount < page * size + size;
    const startIndex = isLast ? Math.max(0, clothesCount - size) : page * size;
    const items = await this.customersService.getCustomerClothes(
      id,
      size,
      startIndex,
    );

    if (items === null) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return {
      index: page,
      size,
      isLast,
      items,
    };
  }

  @Post(':id/clothes/create')
  async createCustomerClothe(
    @Param() { id }: ParamPostCreateCustomerClotheDTO,
    @Body() body: InPostCreateCustomerClotheDTO,
  ): Promise<OutPostCreateCustomerClotheDTO> {
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    if (!(await this.customersService.doesCustomerExist(id))) {
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
    if (!(await this.customersService.doesCustomerExist(id))) {
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

    return this.customersCompatibilityService.getFullCompatibility(id, otherId);
  }
}
