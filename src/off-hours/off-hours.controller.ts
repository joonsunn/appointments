import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { OffHoursService } from './off-hours.service';
import { CreateOffHourDto } from './dto/create-off-hour.dto';
import { UpdateOffHourDto } from './dto/update-off-hour.dto';

@Controller('off-hours')
export class OffHoursController {
  constructor(private readonly offHoursService: OffHoursService) {}

  @Get('all')
  async findAll() {
    return await this.offHoursService.findAll();
  }

  @Post()
  async create(@Body() createOffHourDto: CreateOffHourDto) {
    return await this.offHoursService.create(createOffHourDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOffHourDto: UpdateOffHourDto,
  ) {
    return await this.offHoursService.update({ id, ...updateOffHourDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.offHoursService.remove({ id });
  }
}
