import { Controller, Get, Param } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { YYYYMMDDValidationPipe } from 'src/off-days/pipes/yyyy-mm-dd-validation.pipe';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get(':date')
  findAllOnDate(@Param('date', YYYYMMDDValidationPipe) date: string) {
    return this.slotsService.findAllOnDate(date);
  }
}
