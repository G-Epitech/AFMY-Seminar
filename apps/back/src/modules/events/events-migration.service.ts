import { Inject, Injectable } from '@nestjs/common';
import { EventsFilters } from '@seminar/common';
import { EventsService } from './events.service';
import { EventLegacyDto } from '../../types/legacy-api/dtos';
import {
  Event as PrismaEvent,
  Location as PrismaEventLocation,
} from '.prisma/client';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import { EmployeesMigrationService } from '../employees/employees-migration.service';

@Injectable()
export class EventsMigrationService extends EventsService {
  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  @Inject(EmployeesMigrationService)
  private readonly _employeesMigrationService: EmployeesMigrationService;

  public async syncEvents(filters: EventsFilters): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) {
      return;
    }
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

    events.data = events.data.filter((event) => {
      if (existingLegacyIds.includes(event.id)) {
        return false;
      }
      const date = new Date(event.date);
      return !(
        filters.year &&
        date.getFullYear() !== filters.year &&
        filters.month &&
        date.getMonth() !== filters.month
      );
    });

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
    const employees = await this._prismaService.employee.findMany({
      select: {
        id: true,
        legacyId: true,
      },
    });

    const employeesMap = new Map<number, number>(
      employees
        .filter((employee) => employee.legacyId)
        .map((employee) => [employee.legacyId!, employee.id]),
    );
    console.log(employeesMap);
    const data = toCreate.map((event): Omit<PrismaEvent, 'id'> => {
      console.log(
        `Looking for: ${event.employee_id}`,
        employeesMap.get(event.employee_id),
      );
      const start = new Date(event.date);
      const end = new Date(start);
      const hoursToAdd = event.duration / 60;
      const minutesToAdd = event.duration % 60;
      const daysToAdd = start.getHours() + hoursToAdd >= 24 ? 1 : 0;
      end.setDate(start.getDate() + daysToAdd);
      end.setHours(
        daysToAdd > 0
          ? start.getHours() + hoursToAdd - 24
          : start.getHours() + hoursToAdd,
      );
      end.setMinutes(end.getMinutes() + minutesToAdd);
      end.setSeconds(0);
      return {
        locationId: locationsMap.get(
          event.location_name + event.location_x + event.location_y,
        )!,
        title: event.name,
        maxParticipants: event.max_participants,
        employeeId: employeesMap.get(event.employee_id)!,
        start: new Date(event.date),
        end: end,
        legacyId: event.id,
        type: event.type,
      };
    });

    await this._prismaService.event.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async getEventsCount(filters: EventsFilters): Promise<number> {
    await this.syncEvents(filters);
    return super.getEventsCount(filters);
  }
}
