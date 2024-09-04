import { Module } from '@nestjs/common';
import { LegacyApiModule } from '../providers/legacy-api/legacy-api.module';

@Module({
  imports: [LegacyApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
