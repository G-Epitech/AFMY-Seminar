import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers';
import { EventsService as OriginalEventsService } from './events.service';
import { EventsController } from './events.controller';
import { AuthModule } from '../auth/auth.module';
import { EventsMigrationService } from './events-migration.service';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';
import { EmployeesModule } from '../employees/employees.module';

const EventsService = {
  provide: OriginalEventsService,
  useClass: EventsMigrationService,
};

@Module({
  imports: [PrismaModule, AuthModule, LegacyApiModule, EmployeesModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
