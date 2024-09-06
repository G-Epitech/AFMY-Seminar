import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { InGetImageDto } from '@seminar/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@Controller('images')
export class ImagesController {
  @Inject(ImagesService)
  private _imagesService: ImagesService;

  @Public()
  @Get(':token')
  async getImage(
    @Res() res: Response,
    @Param() { token }: InGetImageDto,
  ): Promise<Response | string> {
    const typedImage = await this._imagesService.getImageOf(token);

    if (!typedImage) {
      throw new NotFoundException('Image not found');
    }
    return res
      .set('Content-Type', `image/${typedImage.type}`)
      .send(typedImage.image);
  }
}
