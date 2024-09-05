import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers';
import { AuthModule } from '../auth/auth.module';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
