import { Inject, Injectable } from '@nestjs/common';
import { TipsService } from './tips.service';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import { TipLegacyDto } from '../../types/legacy-api/dtos';
import { CreateTipCandidate } from '../../types/tips';

@Injectable()
export class TipsMigrationService extends TipsService {
  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(TipsService)
  private async syncTips(): Promise<void> {
    if (!this._authEmployeeContext.isLegacyAuthenticated) {
      return;
    }

    let tips: TipLegacyDto[] = [];

    try {
      tips = (
        await this._legacyApiService.request(
          'GET /tips',
          {},
          this._authEmployeeContext.employee.legacyToken!,
        )
      ).data;
    } catch (error) {
      console.error('Failed to fetch tips from legacy API', error);
      return;
    }

    await this.prismaService.tip.createMany({
      data: tips.map(
        (tip: TipLegacyDto): CreateTipCandidate => ({
          legacyId: tip.id,
          title: tip.title,
          content: tip.tip,
        }),
      ),
      skipDuplicates: true,
    });
  }

  async getTipsCount(): Promise<number> {
    await this.syncTips();
    return super.getTipsCount();
  }
}
