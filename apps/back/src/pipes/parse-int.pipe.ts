import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { BadRequest } from '../classes/responses';
import { INVALID_NUMBER } from '@seminar/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);

    if (!isNaN(val)) {
      return val;
    }
    if (metadata.data) {
      throw new BadRequest({ errors: { [metadata.data]: INVALID_NUMBER } });
    } else {
      throw new BadRequest({ message: 'Invalid number format' });
    }
  }
}
