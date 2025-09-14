import { Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { ConfigsRepository } from './configs.repository';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ConfigsService {
  constructor(
    private readonly configsRepository: ConfigsRepository,
    private readonly dbService: DbService,
  ) {}

  async create(dto: CreateConfigDto, tx?: Prisma.TransactionClient) {
    const result = await this.configsRepository.create(dto, tx);
    return result;
  }

  async findOne(tx?: Prisma.TransactionClient) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const result = await this.configsRepository.findOne(tx);

      if (!result) {
        return await this.create({} as CreateConfigDto, tx);
      }

      return result;
    };

    if (tx) {
      return await performAction(tx);
    } else {
      return await this.dbService.prisma.$transaction((tx) => {
        return performAction(tx);
      });
    }
  }

  async update(
    request: { data: UpdateConfigDto },
    tx?: Prisma.TransactionClient,
  ) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const config = await this.findOne(tx);

      const result = await this.configsRepository.update(
        {
          id: config.id,
          ...request.data,
        },
        tx,
      );

      return result;
    };

    if (tx) {
      return await performAction(tx);
    } else {
      return await this.dbService.prisma.$transaction((tx) => {
        return performAction(tx);
      });
    }
  }
}
