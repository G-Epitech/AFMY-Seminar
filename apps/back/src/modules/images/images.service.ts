import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import { JwtService } from '@nestjs/jwt';
import { ImageTokenPayload, ImageTokenType } from '../../types/images';
import { ImageTyped } from '../../types/images/image-typed.type';
import fetch from 'node-fetch';
import { convertPhotoFormat } from '../../utils';

@Injectable()
export class ImagesService {
  @Inject(PrismaService)
  private _prismaService: PrismaService;

  @Inject(JwtService)
  private _jwtService: JwtService;

  private createToken(payload: ImageTokenPayload): string {
    return this._jwtService.sign(payload);
  }

  private isValidTokenPayload(payload: ImageTokenPayload): boolean {
    const isValidId = 'id' in payload && typeof payload.id === 'number';
    const isValidType =
      'type' in payload && Object.values(ImageTokenType).includes(payload.type);

    return isValidId && isValidType;
  }

  private async verifyToken(
    token: string,
  ): Promise<ImageTokenPayload | undefined> {
    try {
      const payload: ImageTokenPayload = await this._jwtService.verifyAsync(
        token,
        {
          ignoreExpiration: false,
        },
      );

      return this.isValidTokenPayload(payload) ? payload : undefined;
    } catch {
      return undefined;
    }
  }

  private async getClotheImage(id: number): Promise<ImageTyped | undefined> {
    const clothe = await this._prismaService.clothe.findUnique({
      where: { id },
      select: {
        image: true,
      },
    });

    if (!clothe) {
      return undefined;
    }

    return {
      image: Buffer.from(clothe.image, 'base64'),
      type: 'png',
    };
  }

  private async getPlaceholderImage(name: string): Promise<ImageTyped> {
    const avatar = await fetch(
      `https://ui-avatars.com/api/?background=random&name=${name}`,
    );
    const buffer = await avatar.buffer();
    return {
      image: buffer,
      type: 'png',
    };
  }

  private async getCustomerImage(id: number): Promise<ImageTyped | undefined> {
    const customer = await this._prismaService.customer.findUnique({
      where: { id },
      select: {
        photo: true,
        photoFormat: true,
        name: true,
        surname: true,
      },
    });

    if (!customer) {
      return undefined;
    }

    const { photo, photoFormat } = customer;

    if (!photo || !photoFormat) {
      return this.getPlaceholderImage(`${customer.name}+${customer.surname}`);
    } else {
      return {
        image: Buffer.from(photo, 'base64'),
        type: convertPhotoFormat(photoFormat),
      };
    }
  }

  private async getEmployeeImage(id: number): Promise<ImageTyped | undefined> {
    const employee = await this._prismaService.employee.findUnique({
      where: { id },
      select: {
        photo: true,
        photoFormat: true,
        name: true,
        surname: true,
      },
    });

    if (!employee) {
      return undefined;
    }

    const { photo, photoFormat } = employee;

    if (!photo || !photoFormat) {
      return this.getPlaceholderImage(`${employee.name}+${employee.surname}`);
    } else {
      return {
        image: Buffer.from(photo, 'base64'),
        type: convertPhotoFormat(photoFormat),
      };
    }
  }

  public getLinkOf(payload: ImageTokenPayload): string {
    return `/images/${this.createToken(payload)}`;
  }

  public async getImageOf(token: string): Promise<ImageTyped | undefined> {
    const payload = await this.verifyToken(token);

    console.log(payload);
    if (!payload) {
      return undefined;
    }
    switch (payload.type) {
      case ImageTokenType.CLOTHE:
        return this.getClotheImage(payload.id);
      case ImageTokenType.CUSTOMER:
        return this.getCustomerImage(payload.id);
      case ImageTokenType.EMPLOYEE:
        return this.getEmployeeImage(payload.id);
      default:
        return undefined;
    }
  }
}
