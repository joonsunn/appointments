import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { ConfigsModule } from './configs/configs.module';
import { OffDaysModule } from './off-days/off-days.module';
import { OffHoursModule } from './off-hours/off-hours.module';
import { SlotsModule } from './slots/slots.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    DbModule,
    ConfigsModule,
    OffDaysModule,
    OffHoursModule,
    SlotsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
