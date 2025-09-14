import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateAppointmentDto {
  @Type(() => Date)
  @IsDate()
  appointmentDateTime: Date;
}
