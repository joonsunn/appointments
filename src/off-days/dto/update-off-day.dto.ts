import { PartialType } from '@nestjs/mapped-types';
import { CreateOffDayDto } from './create-off-day.dto';

export class UpdateOffDayDto extends PartialType(CreateOffDayDto) {}
