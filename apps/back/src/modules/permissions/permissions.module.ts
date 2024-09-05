import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [PermissionsModule],
  exports: [PermissionsModule],
})
export class PermissionsModule {}
