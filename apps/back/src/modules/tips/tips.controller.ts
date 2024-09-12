import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { AuthEmployeeContext } from '../auth/auth.employee.context';
import {
  GetTipsDto,
  IdOf,
  InPatchTipDto,
  Permission,
  PostCreateTipDto,
  Tip,
} from '@seminar/common';
import { Allow } from '../employees/decorators/allow.decorator';

@Controller('tips')
export class TipsController {
  @Inject(TipsService)
  private readonly _tipsService: TipsService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Get()
  async getTips(): Promise<GetTipsDto> {
    const count = await this._tipsService.getTipsCount();
    const tips = await this._tipsService.getTips();
    return { count, tips };
  }

  @Patch(':id')
  @Allow(Permission.MANAGER)
  async updateTip(
    @Param('id') id: IdOf<Tip>,
    @Body() body: InPatchTipDto,
  ): Promise<void> {
    if (!(await this._tipsService.doesTipExist(id))) {
      return;
    }

    await this._tipsService.updateTip(id, body);
  }

  @Delete(':id')
  @Allow(Permission.MANAGER)
  @HttpCode(204)
  async deleteTip(@Param('id') id: IdOf<Tip>): Promise<void> {
    if (!(await this._tipsService.doesTipExist(id))) {
      return;
    }

    await this._tipsService.deleteTip(id);
  }

  @Post(':id/create')
  @Allow(Permission.MANAGER)
  async createTip(@Body() body: PostCreateTipDto): Promise<void> {
    await this._tipsService.createTip({ ...body, legacyId: null });
  }
}
