import { IsYYYYMMDD } from 'src/utils/is-yyyy-mm-dd.decorator';

export class CreateOffDayDto {
  @IsYYYYMMDD()
  date: string;
}
