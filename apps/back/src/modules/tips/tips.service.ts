import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import { IdOf, Tip } from '@seminar/common';
import { CreateTipCandidate, UpdateTipCandidate } from '../../types/tips';

@Injectable()
export class TipsService {
  @Inject(PrismaService)
  protected readonly prismaService: PrismaService;

  async getTipsCount(): Promise<number> {
    return this.prismaService.tip.count();
  }

  async getTips(): Promise<Tip[]> {
    return this.prismaService.tip.findMany();
  }

  async getTip(id: IdOf<Tip>): Promise<Tip | null> {
    return this.prismaService.tip.findUnique({
      where: { id },
    });
  }

  async doesTipExist(id: IdOf<Tip>): Promise<boolean> {
    return (await this.prismaService.tip.count({ where: { id } })) > 0;
  }

  async createTip(data: CreateTipCandidate): Promise<Tip> {
    return this.prismaService.tip.create({
      data,
    });
  }

  async updateTip(id: IdOf<Tip>, data: UpdateTipCandidate): Promise<Tip> {
    return this.prismaService.tip.update({
      where: { id },
      data,
    });
  }

  async deleteTip(id: IdOf<Tip>): Promise<void> {
    await this.prismaService.tip.delete({
      where: { id },
    });
  }
}
