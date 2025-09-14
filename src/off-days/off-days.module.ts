import { Module } from '@nestjs/common';
import { OffDaysService } from './off-days.service';
import { OffDaysController } from './off-days.controller';
import { OffDaysRepository } from './off-days.repository';
import { ConfigsModule } from 'src/configs/configs.module';

@Module({
  controllers: [OffDaysController],
  providers: [OffDaysService, OffDaysRepository],
  imports: [ConfigsModule],
  exports: [OffDaysService],
})
export class OffDaysModule {}
