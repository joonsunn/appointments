import { Module } from '@nestjs/common';
import { OffHoursService } from './off-hours.service';
import { OffHoursController } from './off-hours.controller';
import { OffDaysRepository } from './off-hours.repository';
import { ConfigsModule } from 'src/configs/configs.module';

@Module({
  controllers: [OffHoursController],
  providers: [OffHoursService, OffDaysRepository],
  imports: [ConfigsModule],
  exports: [OffHoursService],
})
export class OffHoursModule {}
