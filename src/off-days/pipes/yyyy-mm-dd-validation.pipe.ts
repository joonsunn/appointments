import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isYYYYMMDD } from 'src/utils/is-yyyy-mm-dd.validator';

@Injectable()
export class YYYYMMDDValidationPipe implements PipeTransform<any, string> {
  transform(value: any): string {
    if (!isYYYYMMDD(value)) {
      throw new BadRequestException('Date must be in YYYY-MM-DD format');
    }
    return value;
  }
}
