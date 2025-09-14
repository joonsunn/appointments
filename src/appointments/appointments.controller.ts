import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { YYYYMMDDValidationPipe } from 'src/off-days/pipes/yyyy-mm-dd-validation.pipe';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  async findAll() {
    return await this.appointmentsService.findAll();
  }

  @Get('by-date/:date')
  async findAllOnDate(@Param('date', YYYYMMDDValidationPipe) date: string) {
    const dateInput = new Date(date);
    return await this.appointmentsService.findAllOnDate({
      appointmentDateTime: dateInput,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentsService.update({
      id,
      ...updateAppointmentDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.appointmentsService.remove({ id });
  }
}
