import { Module } from '@nestjs/common';
import { LegacyApiService } from './legacy-api.service';

@Module({
  providers: [LegacyApiService],
  exports: [LegacyApiService],
})
export class LegacyApiModule {}
