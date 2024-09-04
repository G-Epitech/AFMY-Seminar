import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { EmployeesMigrationService } from './employees-migration.service';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';

@Module({
  imports: [PrismaModule, LegacyApiModule],
  providers: [EmployeesService, EmployeesMigrationService],
  exports: [EmployeesService, EmployeesMigrationService],
})
export class EmployeesModule {}
