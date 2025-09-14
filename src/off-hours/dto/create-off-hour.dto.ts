import { IsHHMM } from 'src/utils/is-hh-mm.decorator';

export class CreateOffHourDto {
  @IsHHMM()
  startTime: string;
  @IsHHMM()
  endTime: string;
}
