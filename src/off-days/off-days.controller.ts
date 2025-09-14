import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { OffDaysService } from './off-days.service';
import { CreateOffDayDto } from './dto/create-off-day.dto';
import { YYYYMMDDValidationPipe } from './pipes/yyyy-mm-dd-validation.pipe';

@Controller('off-days')
export class OffDaysController {
  constructor(private readonly offDaysService: OffDaysService) {}

  @Get('all')
  async findAll() {
    return await this.offDaysService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateOffDayDto) {
    return await this.offDaysService.create(dto);
  }

  @Delete(':date')
  async remove(@Param('date', YYYYMMDDValidationPipe) date: string) {
    return await this.offDaysService.remove({ date });
  }
}
