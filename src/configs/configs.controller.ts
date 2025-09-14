import { Controller, Get, Body, Patch } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  findOne() {
    return this.configsService.findOne();
  }

  @Patch()
  update(@Body() dto: UpdateConfigDto) {
    return this.configsService.update({ data: dto });
  }
}
