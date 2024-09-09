import { PrismaModule } from '../../providers';
import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { AuthModule } from '../auth/auth.module';
import { StatisticsMigrationService } from './statistics-migration.service';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';
import { EmployeesModule } from '../employees/employees.module';
import { CustomersModule } from '../customers/customers.module';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LegacyApiModule,
    EmployeesModule,
    CustomersModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsMigrationService, StatisticsService],
})
export class StatisticsModule {}
