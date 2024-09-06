import { Inject, Injectable } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import {
  AstrologicalSign,
  Customer,
  CustomersFilters,
  EncounterStatus,
  IdOf,
  PhotoFormat,
} from '@seminar/common';
import {
  ClotheLegacyDto,
  CustomerLegacyDto,
  EncounterLegacyDto,
  ShortEncounterLegacyDto,
} from '../../types/legacy-api/dtos';
import {
  convertAstrologicalSignToPrisma,
  convertClotheTypeToPrisma,
  convertEncounterStatusToPrisma,
  convertGenderToPrisma,
  convertPhotoFormatToPrisma,
} from '../../utils';
import {
  legacyApiConvertClotheType,
  legacyApiConvertGender,
} from '../../providers/legacy-api/legacy-api-convertors';

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

  private async getLegacyCustomerWithPhotoById(id: IdOf<Customer>): Promise<
    | (CustomerLegacyDto & {
        photo: Buffer | null;
        photoFormat: PhotoFormat | null;
      })
    | null
  > {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return null;
    try {
      const customer = await this.getLegacyCustomerById(id);
      if (!customer) return null;
      const photo = await this._legacyApiService
        .request(
          'GET /customers/{customer_id}/image',
          {
            parameters: {
              customer_id: id,
            },
          },
          this._authEmployeeContext.employee.legacyToken!,
        )
        .then((res) => res.data)
        .catch(() => null);
      return {
        ...customer,
        photo,
        photoFormat: photo ? PhotoFormat.PNG : null,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async getNewCustomers(): Promise<
    (CustomerLegacyDto & {
      photo: Buffer | null;
      photoFormat: PhotoFormat | null;
    })[]
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
            photo: customer.photo?.toString('base64'),
            photoFormat: customer.photoFormat
              ? convertPhotoFormatToPrisma(customer.photoFormat)
              : null,
            address: customer.address,
            phone: customer.phone_number,
            country: 'France',
          })),
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  private async getLegacyCustomerClothes(
    id: IdOf<Customer>,
  ): Promise<ClotheLegacyDto[]> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return [];
    try {
      const res = await this._legacyApiService.request(
        'GET /customers/{customer_id}/clothes',
        {
          parameters: {
            customer_id: id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );
      return res.data;
    } catch (error) {
      return [];
    }
  }

  private async getClothePhoto(
    id: IdOf<ClotheLegacyDto>,
  ): Promise<Buffer | null> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return null;
    try {
      const res = await this._legacyApiService.request(
        'GET /clothes/{clothe_id}/image',
        {
          parameters: {
            clothe_id: id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );
      return res.data;
    } catch (error) {
      return null;
    }
  }

  private async getNewCustomerClothes(
    id: IdOf<Customer>,
  ): Promise<(ClotheLegacyDto & { image: Buffer })[]> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return [];
    try {
      const customer = await this._prismaService.customer.findUnique({
        where: {
          id,
        },
      });

      if (!customer || !customer.legacyId) return [];

      const currentClothesIds = await this._prismaService.clothe.findMany({
        where: {
          customers: {
            some: {
              id,
            },
          },
        },
        select: { legacyId: true },
      });

      const currentClothesIdsSet = new Set(
        currentClothesIds.map(({ legacyId }) => legacyId).filter((id) => !!id),
      );
      const legacyClothes = (
        await this.getLegacyCustomerClothes(customer.legacyId)
      ).filter((c) => !currentClothesIdsSet.has(c.id));

      const legacyClothesWithPhotos = await Promise.all(
        legacyClothes.map(async (c) => {
          const image = await this.getClothePhoto(c.id);
          return image ? { ...c, image } : null;
        }),
      );
      return legacyClothesWithPhotos.filter((c) => !!c);
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  private async syncCustomerClothes(id: IdOf<Customer>): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return;

    try {
      const newClothes = await this.getNewCustomerClothes(id);
      const createdClothes =
        await this._prismaService.clothe.createManyAndReturn({
          data: newClothes.map((clothe) => ({
            legacyId: clothe.id,
            type: convertClotheTypeToPrisma(
              legacyApiConvertClotheType(clothe.type),
            ),
            image: clothe.image.toString('base64'),
          })),
          select: {
            id: true,
          },
        });
      await this._prismaService.customer.update({
        where: {
          id,
        },
        data: {
          clothes: {
            connect: createdClothes.map(({ id }) => ({ id })),
          },
        },
      });
    } catch (error) {
      return;
    }
  }

  private async getLegacyCustomerEncounters(
    id: IdOf<Customer>,
  ): Promise<ShortEncounterLegacyDto[]> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return [];
    try {
      const res = await this._legacyApiService.request(
        'GET /encounters/customer/{customer_id}',
        {
          parameters: {
            customer_id: id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );
      return res.data;
    } catch (error) {
      return [];
    }
  }

  private async getLegacyEncounterById(
    id: IdOf<EncounterLegacyDto>,
  ): Promise<EncounterLegacyDto | null> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return null;

    try {
      const encounter = await this._legacyApiService.request(
        'GET /encounters/{encounter_id}',
        {
          parameters: {
            encounter_id: id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );
      return encounter.data;
    } catch (error) {
      return null;
    }
  }

  private async getNewCustomerEncounters(
    id: IdOf<Customer>,
  ): Promise<EncounterLegacyDto[]> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return [];
    try {
      const customer = await this._prismaService.customer.findUnique({
        where: {
          id: id,
        },
        select: {
          legacyId: true,
          encounters: {
            select: {
              legacyId: true,
            },
          },
        },
      });
      if (!customer || !customer.legacyId) return [];

      const currentEncountersIdsSet = new Set(
        customer.encounters
          .map(({ legacyId }) => legacyId)
          .filter((id) => !!id),
      );

      const newsEncountersLegacyIds = (
        await this.getLegacyCustomerEncounters(customer.legacyId)
      ).filter(({ id }) => !currentEncountersIdsSet.has(id));

      const legacyEncounters = await Promise.all(
        newsEncountersLegacyIds.map((encounter) =>
          this.getLegacyEncounterById(encounter.id),
        ),
      );

      return legacyEncounters.filter((e) => !!e);
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  private async getNewEncounters(): Promise<EncounterLegacyDto[]> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return [];
    try {
      const legacyEncounters = await this._legacyApiService.request(
        'GET /encounters',
        {},
        this._authEmployeeContext.employee.legacyToken!,
      );
      const legacyIds = legacyEncounters.data.map((encounter) => encounter.id);
      const currentIds = await this._prismaService.encounter.findMany({
        select: { legacyId: true },
      });
      const currentIdsSet = new Set(
        currentIds.map(({ legacyId }) => legacyId).filter((id) => !!id),
      );
      const newIds = legacyIds.filter((id) => !currentIdsSet.has(id));
      return (
        await Promise.all(newIds.map((id) => this.getLegacyEncounterById(id)))
      ).filter((e) => !!e);
    } catch (error) {
      return [];
    }
  }

  private async getCustomersIdsByLegacyIds(
    legacyIds: number[],
  ): Promise<{ id: number; legacyId: number | null }[]> {
    return this._prismaService.customer.findMany({
      where: {
        legacyId: {
          in: legacyIds,
        },
      },
      select: {
        id: true,
        legacyId: true,
      },
    });
  }

  private async getCustomersIdsByLegacyIdsAndFetchNews(
    legacyIds: number[],
  ): Promise<{ id: number; legacyId: number | null }[]> {
    const customers = await this.getCustomersIdsByLegacyIds(legacyIds);
    if (customers.length === legacyIds.length) {
      return customers;
    } else {
      await this.syncCustomers();
      return this.getCustomersIdsByLegacyIds(legacyIds);
    }
  }

  private async syncEncountersFromArray(
    encounters: EncounterLegacyDto[],
  ): Promise<void> {
    const customersLegacyIds = [
      ...new Set(encounters.map(({ customer_id }) => customer_id)),
    ];
    const customerIds =
      await this.getCustomersIdsByLegacyIdsAndFetchNews(customersLegacyIds);
    const customersIdsMap = new Map(
      customerIds.map(({ legacyId, id }) => [legacyId, id]),
    );

    await this._prismaService.encounter.createMany({
      data: encounters.map((encounter) => ({
        legacyId: encounter.id,
        date: new Date(encounter.date),
        customerId: customersIdsMap.get(encounter.customer_id)!,
        source: encounter.source,
        comment: encounter.comment,
        status: convertEncounterStatusToPrisma(EncounterStatus.DONE),
      })),
    });
  }

  private async syncCustomerEncounters(id: IdOf<Customer>): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return;

    try {
      const newEncounters = await this.getNewCustomerEncounters(id);
      await this.syncEncountersFromArray(newEncounters);
    } catch (error) {
      console.log(error);
    }
  }

  private async syncEncounters(): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) return;

    try {
      const newEncounters = await this.getNewEncounters();

      await this.syncEncountersFromArray(newEncounters);
    } catch (error) {
      console.log(error);
    }
  }

  public async getCustomersCount(filters?: CustomersFilters): Promise<number> {
    await this.syncCustomers();
    return super.getCustomersCount(filters);
  }

  public async getCustomerClothesCount(id: IdOf<Customer>): Promise<number> {
    await this.syncCustomerClothes(id);
    return super.getCustomerClothesCount(id);
  }

  public async getCustomerEncountersCount(id: IdOf<Customer>): Promise<number> {
    await this.syncCustomerEncounters(id);
    return super.getCustomerEncountersCount(id);
  }

  public async getEncountersSources(): Promise<string[]> {
    await this.syncEncounters();
    return super.getEncountersSources();
  }
}
