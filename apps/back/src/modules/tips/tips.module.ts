import { Module } from '@nestjs/common';
import { TipsController } from './tips.controller';
import { TipsMigrationService } from './tips-migration.service';
import { TipsService as OriginalTipsService } from './tips.service';
import { PrismaModule } from '../../providers';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';
import { AuthModule } from '../auth/auth.module';

const TipsService = {
  provide: OriginalTipsService,
  useClass: TipsMigrationService,
};

@Module({
  imports: [PrismaModule, LegacyApiModule, AuthModule],
  controllers: [TipsController],
  providers: [TipsService, TipsMigrationService],
})
export class TipsModule {}
