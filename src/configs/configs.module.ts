import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { ConfigsRepository } from './configs.repository';

@Module({
  controllers: [ConfigsController],
  providers: [ConfigsService, ConfigsRepository],
  exports: [ConfigsService],
})
export class ConfigsModule {}
