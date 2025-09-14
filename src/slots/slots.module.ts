import { forwardRef, Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { ConfigsModule } from 'src/configs/configs.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { OffDaysModule } from 'src/off-days/off-days.module';
import { OffHoursModule } from 'src/off-hours/off-hours.module';

@Module({
  imports: [
    ConfigsModule,
    forwardRef(() => AppointmentsModule),
    OffDaysModule,
    OffHoursModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
