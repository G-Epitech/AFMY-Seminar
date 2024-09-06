import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers';
import { CustomersService as OriginalCustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AuthModule } from '../auth/auth.module';
import { CustomersCompatibilityService } from './compatiblity.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { CustomersMigrationService } from './customers-migration.service';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';
import { ImagesModule } from '../images/images.module';

const CustomersService = {
  provide: OriginalCustomersService,
  useClass: CustomersMigrationService,
};

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PermissionsModule,
    LegacyApiModule,
    ImagesModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersCompatibilityService],
})
export class CustomersModule {}
