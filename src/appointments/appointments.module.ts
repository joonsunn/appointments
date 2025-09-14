import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { ConfigsModule } from 'src/configs/configs.module';
import { OffDaysModule } from 'src/off-days/off-days.module';
import { OffHoursModule } from 'src/off-hours/off-hours.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
  imports: [ConfigsModule, OffDaysModule, OffHoursModule],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
