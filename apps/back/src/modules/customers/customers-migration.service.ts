import { Inject, Injectable } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import {
  AstrologicalSign,
  Customer,
  CustomersFilters,
  IdOf,
  PhotoFormat,
} from '@seminar/common';
import { CustomerLegacyDto } from '../../types/legacy-api/dtos';
import {
  convertAstrologicalSignToPrisma,
  convertGenderToPrisma,
  convertPhotoFormatToPrisma,
} from '../../utils';
import { legacyApiConvertGender } from '../../providers/legacy-api/legacy-api-convertors';

@Injectable()
export class CustomersMigrationService extends CustomersService {
  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  private async getLegacyCustomerById(
    id: IdOf<Customer>,
  ): Promise<CustomerLegacyDto | null> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return null;

    try {
      const customer = await this._legacyApiService.request(
        'GET /customers/{customer_id}',
        {
          parameters: {
            customer_id: id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );
      return customer.data;
    } catch (error) {
      return null;
    }
  }

  private async getLegacyCustomerWithPhotoById(
    id: IdOf<Customer>,
  ): Promise<
    (CustomerLegacyDto & { photo: Buffer; photoFormat: PhotoFormat }) | null
  > {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return null;

    try {
      const customer = await this.getLegacyCustomerById(id);
      if (!customer) return null;
      const photo = await this._legacyApiService.request(
        'GET /customers/{customer_id}/image',
        {
          parameters: {
            customer_id: id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );
      return { ...customer, photo: photo.data, photoFormat: PhotoFormat.PNG };
    } catch (error) {
      return null;
    }
  }

  private async getNewCustomers(): Promise<
    (CustomerLegacyDto & { photo: Buffer; photoFormat: PhotoFormat })[]
  > {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return [];
    try {
      const legacyShortCustomers = await this._legacyApiService.request(
        'GET /customers',
        {},
        this._authEmployeeContext.employee.legacyToken!,
      );
      const legacyIds = legacyShortCustomers.data.map(
        (customer) => customer.id,
      );
      const currentIds = await this._prismaService.customer.findMany({
        select: { legacyId: true },
      });
      const currentIdsSet = new Set(
        currentIds.map((customer) => customer.legacyId),
      );
      const newIds = legacyIds.filter((id) => !currentIdsSet.has(id));
      return (
        await Promise.all(
          newIds.map((id) => this.getLegacyCustomerWithPhotoById(id)),
        )
      ).filter((c) => !!c);
    } catch (error) {
      return [];
    }
  }

  private async syncCustomers(): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return;
    try {
      const newCustomers = await this.getNewCustomers();

      await this._prismaService.customer.createMany({
        data: newCustomers
          .filter((c) => !!c)
          .map((customer) => ({
            legacyId: customer.id,
            name: customer.name,
            email: customer.email,
            surname: customer.surname,
            description: customer.description,
            birthDate: new Date(customer.birth_date),
            gender: convertGenderToPrisma(
              legacyApiConvertGender(customer.gender),
            ),
            sign: convertAstrologicalSignToPrisma(
              customer.astrological_sign as AstrologicalSign,
            ),
            photo: customer.photo.toString('base64'),
            photoFormat: convertPhotoFormatToPrisma(customer.photoFormat),
          })),
      });
    } catch (error) {
      return;
    }
  }

  public async getCustomersCount(filters?: CustomersFilters): Promise<number> {
    await this.syncCustomers();
    return super.getCustomersCount(filters);
  }
}
