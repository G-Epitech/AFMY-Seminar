import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import {
  Encounter as PrismaEncounter,
  EncounterStatus as PrismaEncounterStatus,
  Event as PrismaEvent,
  Location as PrismaEventLocation,
} from '@prisma/client';
import { Encounter, EncounterStatus, IdOf } from '@seminar/common';
import { EventLegacyDto } from '../../types/legacy-api/dtos';
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

  public async syncEvents(): Promise<void> {
    const events = await this._legacyApiService.request(
      'GET /events',
      {},
      this._authEmployeeContext.employee.legacyToken!,
    );

    let toCreate: EventLegacyDto[] = [];

    const locationsToCreate: Omit<PrismaEventLocation, 'id'>[] = [];

    const existingLegacyIds: number[] = (
      await this._prismaService.event.findMany({
        select: {
          legacyId: true,
        },
      })
    )
      .filter((event) => event.legacyId)
      .map((event) => event.legacyId!);

    events.data = events.data.filter(
      (event) => !existingLegacyIds.includes(event.id),
    );

    for (const event of events.data) {
      const eventToCreate = await this._legacyApiService.request(
        'GET /events/{event_id}',
        {
          parameters: {
            event_id: event.id,
          },
        },
        this._authEmployeeContext.employee.legacyToken!,
      );

      locationsToCreate.push({
        name: eventToCreate.data.location_name,
        x: eventToCreate.data.location_x,
        y: eventToCreate.data.location_y,
      });

      toCreate.push(eventToCreate.data);
    }

    toCreate = toCreate.filter((event) => event);

    if (!toCreate.length) {
      console.log('No events to sync');
      return;
    }

    await this._employeesMigrationService.syncEmployees();

    await this._prismaService.location.createMany({
      data: locationsToCreate,
      skipDuplicates: true,
    });

    const locations = (
      await this._prismaService.location.findMany({
        select: {
          id: true,
          name: true,
          x: true,
          y: true,
        },
      })
    ).map((location): [string, number] => {
      return [location.name + location.x + location.y, location.id];
    });

    const locationsMap = new Map<string, number>(locations);

    const employeesMap = new Map<number, number>(
      (
        await this._prismaService.employee.findMany({
          select: {
            id: true,
            legacyId: true,
          },
        })
      )
        .filter((employee) => employee.legacyId)
        .map((employee) => [employee.legacyId!, employee.id]),
    );

    await this._prismaService.event.createMany({
      data: toCreate.map(
        (event): Omit<PrismaEvent, 'id'> => ({
          locationId: locationsMap.get(
            event.location_name + event.location_x + event.location_y,
          )!,
          title: event.name,
          maxParticipants: event.max_participants,
          employeeId: employeesMap.get(event.employee_id)!,
          date: new Date(event.date),
          legacyId: event.id,
          type: event.type,
        }),
      ),
    });
  }

  public async syncEncounters(): Promise<void> {
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
    });
  }
}
