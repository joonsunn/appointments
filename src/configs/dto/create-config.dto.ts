import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  maxSlots: number;

  @IsNumber()
  @Min(5)
  slotDuration: number;

  @IsString()
  timeZone: string;

  @IsBoolean()
  sunday: boolean;

  @IsBoolean()
  monday: boolean;

  @IsBoolean()
  tuesday: boolean;

  @IsBoolean()
  wednesday: boolean;

  @IsBoolean()
  thursday: boolean;

  @IsBoolean()
  friday: boolean;

  @IsBoolean()
  saturday: boolean;
}
