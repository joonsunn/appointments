import { Controller, Get, Body, Patch } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  async findOne() {
    return await this.configsService.findOne();
  }

  @Patch()
  async update(@Body() dto: UpdateConfigDto) {
    return await this.configsService.update({ data: dto });
  }
}
