import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers';
import {
  compatibilityScores,
  Customer,
  FullCompatibility,
  IdOf,
} from '@seminar/common';
import {
  convertAstrologicalSign,
  convertGender,
  convertPhotoFormat,
} from '../../utils';

@Injectable()
export class CustomersCompatibilityService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  public async getFullCompatibility(
    customerA: IdOf<Customer>,
    customerB: IdOf<Customer>,
  ): Promise<FullCompatibility> {
    const customerAData = await this.prismaService.customer.findUnique({
      where: { id: customerA },
    });
    const customerBData = await this.prismaService.customer.findUnique({
      where: { id: customerB },
    });

    if (!customerAData || !customerBData) {
      throw new NotFoundException('Customer not found');
    }

    return {
      compatibility:
        compatibilityScores[convertAstrologicalSign(customerAData.sign)][
          convertAstrologicalSign(customerBData.sign)
        ],
      customerA: {
        ...customerAData,
        sign: convertAstrologicalSign(customerAData.sign),
        gender: convertGender(customerAData.gender),
        photoFormat: customerAData.photoFormat
          ? convertPhotoFormat(customerAData.photoFormat)
          : null,
      },
      customerB: {
        ...customerBData,
        sign: convertAstrologicalSign(customerBData.sign),
        gender: convertGender(customerBData.gender),
        photoFormat: customerBData.photoFormat
          ? convertPhotoFormat(customerBData.photoFormat)
          : null,
      },
    };
  }
}
