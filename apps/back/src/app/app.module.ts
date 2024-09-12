import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { EmployeesModule } from '../modules/employees/employees.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomersModule } from '../modules/customers/customers.module';
import { LegacyApiModule } from '../providers/legacy-api/legacy-api.module';
import { AuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { StatisticsModule } from '../modules/statistics/statistics.module';
import { ImagesModule } from '../modules/images/images.module';
import { EventsModule } from '../modules/events/events.module';
import { TipsModule } from '../modules/tips/tips.module';

@Module({
  imports: [
    LegacyApiModule,
    AuthModule,
    EmployeesModule,
    CustomersModule,
    StatisticsModule,
    ImagesModule,
    EventsModule,
    TipsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
