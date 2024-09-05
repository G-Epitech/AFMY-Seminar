import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AuthModule } from '../auth/auth.module';
import { CustomersCompatibilityService } from './compatiblity.service';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, AuthModule, PermissionsModule],
  controllers: [CustomersController, CustomersCompatibilityService],
  providers: [CustomersService],
})
export class CustomersModule {}
