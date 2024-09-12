import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import {
  Encounter as PrismaEncounter,
  EncounterStatus as PrismaEncounterStatus,
} from '@prisma/client';
import { Encounter, EncounterStatus, IdOf } from '@seminar/common';
import { EmployeesMigrationService } from '../employees/employees-migration.service';
import { CreateCustomerEncounterCandidate } from '../../types/customers';
import { CustomersMigrationService } from '../customers/customers-migration.service';

@Injectable()
export class StatisticsMigrationService {
  @Inject(PrismaService)
  protected readonly _prismaService: PrismaService;

  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(EmployeesMigrationService)
  private readonly _employeesMigrationService: EmployeesMigrationService;

  @Inject(CustomersMigrationService)
  private readonly _customersMigrationService: CustomersMigrationService;

  public async syncEncounters(): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) {
      return;
    }
    let legacyIds: IdOf<Encounter>[] = (
      await this._prismaService.event.findMany({
        select: {
          legacyId: true,
        },
      })
    )
      .filter((event) => event.legacyId)
      .map((event) => event.legacyId!);

    const existingIds: IdOf<Encounter>[] = (
      await this._prismaService.encounter.findMany({
        select: {
          id: true,
        },
      })
    ).map((encounter) => encounter.id);

    legacyIds = legacyIds.filter((id) => !existingIds.includes(id));

    const encountersToCreate: (CreateCustomerEncounterCandidate & {
      legacyId: number;
    })[] = [];

    for (const legacyId of legacyIds) {
      const encounter = await this._legacyApiService.request(
        'GET /encounters/{encounter_id}',
        {
          parameters: {
            encounter_id: legacyId,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );

      const temp: any = {
        ...encounter.data,
        customerId: encounter.data.customer_id,
        status: EncounterStatus.DONE,
        isPositive: true,
        date: new Date(encounter.data.date),
        legacyId: encounter.data.id,
      };

      delete temp.customer_id;

      encountersToCreate.push(temp);
    }

    if (!encountersToCreate.length) {
      console.log('No encounters to sync');
      return;
    }

    await this._customersMigrationService.syncCustomers();

    const customersMap = new Map<number, number>(
      (
        await this._prismaService.customer.findMany({
          select: {
            id: true,
            legacyId: true,
          },
        })
      )
        .filter((customer) => customer.legacyId)
        .map((customer) => [customer.legacyId!, customer.id]),
    );

    await this._prismaService.encounter.createMany({
      data: encountersToCreate.map(
        (
          encounter: CreateCustomerEncounterCandidate & { legacyId: number },
        ): Omit<PrismaEncounter, 'id'> => ({
          ...encounter,
          status: PrismaEncounterStatus.DONE,
          legacyId: encounter.legacyId,
          customerId: customersMap.get(encounter.customerId)!,
        }),
      ),
      skipDuplicates: true,
    });
  }
}
