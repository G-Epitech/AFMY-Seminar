import { forwardRef, Module } from '@nestjs/common';
import { EmployeesService as OriginalEmployeesService } from './employees.service';
import { PrismaModule } from '../../providers';
import { EmployeesMigrationService } from './employees-migration.service';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';
import { AuthModule } from '../auth/auth.module';
import { EmployeesController } from './employees.controller';
import { ImagesModule } from '../images/images.module';
import { PermissionsModule } from '../permissions/permissions.module';

const EmployeesService = {
  provide: OriginalEmployeesService,
  useClass: EmployeesMigrationService,
};

@Module({
  imports: [
    PrismaModule,
    ImagesModule,
    LegacyApiModule,
    PermissionsModule,
    forwardRef(() => AuthModule),
  ],
  providers: [EmployeesService, EmployeesMigrationService],
  exports: [EmployeesService, EmployeesMigrationService],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
