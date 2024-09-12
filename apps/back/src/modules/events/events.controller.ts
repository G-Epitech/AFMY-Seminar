import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  GetEventsDTO,
  GetEventsQuery,
  IdOf,
  InUpdateEventDTO,
  MeetingEvent,
  Permission,
} from '@seminar/common';
import { EventsService } from './events.service';
import { AuthEmployeeContext } from '../auth/auth.employee.context';

@Controller('events')
export class EventsController {
  @Inject(EventsService)
  private readonly _eventsService: EventsService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Get()
  public async getEvents(
    @Query() query: GetEventsQuery,
  ): Promise<GetEventsDTO> {
    const count = await this._eventsService.getEventsCount(query);
    const events = await this._eventsService.getEvents(query);

    return { count, events };
  }

  @Get(':id')
  public async getEventById(
    @Query('id') id: IdOf<MeetingEvent>,
  ): Promise<MeetingEvent | null> {
    return this._eventsService.getEventById(id);
  }

  @Patch(':id')
  public async updateEvent(
    @Param('id') id: IdOf<MeetingEvent>,
    @Body() data: InUpdateEventDTO,
  ): Promise<MeetingEvent> {
    const event = await this._eventsService.getEventById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (
      this._authEmployeeContext.employee.permission !== Permission.MANAGER &&
      this._authEmployeeContext.employee.id !== event.employeeId
    ) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    return (await this._eventsService.updateEvent(id, data))!;
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteEvent(@Param('id') id: IdOf<MeetingEvent>): Promise<void> {
    const event = await this._eventsService.getEventById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (
      this._authEmployeeContext.employee.permission !== Permission.MANAGER &&
      this._authEmployeeContext.employee.id !== event.employeeId
    ) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }

    await this._eventsService.deleteEvent(id);
  }
}
