import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import { EventsFilters, IdOf, MeetingEvent } from '@seminar/common';
import { CreateEventCandidate, UpdateEventCandidate } from '../../types/events';

@Injectable()
export class EventsService {
  @Inject(PrismaService)
  protected readonly _prismaService: PrismaService;

  async getEventsCount(filters: EventsFilters): Promise<number> {
    const _from = new Date(filters.year, filters.month ?? 0);
    const _to = new Date(filters.year, (filters.month ?? 11) + 1);
    return this._prismaService.event.count({
      where: {
        start: {
          gte: _from,
          lt: _to,
        },
      },
    });
  }

  async getEvents(filters: EventsFilters): Promise<MeetingEvent[]> {
    const _from = new Date(filters.year, filters.month ?? 0);
    const _to = new Date(filters.year, (filters.month ?? 11) + 1);
    return this._prismaService.event.findMany({
      where: {
        start: {
          gte: _from,
          lt: _to,
        },
      },
    });
  }

  async getEventById(id: IdOf<MeetingEvent>): Promise<MeetingEvent | null> {
    return this._prismaService.event.findUnique({
      where: { id },
    });
  }

  async doesEventExist(id: IdOf<MeetingEvent>): Promise<boolean> {
    return (await this._prismaService.event.count({ where: { id } })) > 0;
  }

  async createEvent(data: CreateEventCandidate): Promise<MeetingEvent> {
    return this._prismaService.event.create({ data });
  }

  async updateEvent(
    id: IdOf<MeetingEvent>,
    data: UpdateEventCandidate,
  ): Promise<MeetingEvent | null> {
    if (!(await this.doesEventExist(id))) return null;

    return this._prismaService.event.update({
      where: { id },
      data,
    });
  }

  async deleteEvent(id: IdOf<MeetingEvent>): Promise<void> {
    if (!(await this.doesEventExist(id))) return;

    await this._prismaService.event.delete({ where: { id } });
  }
}
