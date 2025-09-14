import { PartialType } from '@nestjs/mapped-types';
import { CreateOffHourDto } from './create-off-hour.dto';

export class UpdateOffHourDto extends PartialType(CreateOffHourDto) {}
