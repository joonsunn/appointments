import { Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { DbService } from 'src/db/db.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ConfigsRepository {
  constructor(private readonly dbService: DbService) {}

  private configsDb(tx?: Prisma.TransactionClient) {
    if (tx) {
      return tx.configs;
    } else {
      return this.dbService.prisma.configs;
    }
  }

  async create(
    createConfigDto: CreateConfigDto,
    tx?: Prisma.TransactionClient,
  ) {
    const result = await this.configsDb(tx).create({
      data: createConfigDto,
    });

    return result;
  }

  async findOne(tx?: Prisma.TransactionClient) {
    const result = await this.configsDb(tx).findFirst({}); // hardcoded to find first

    return result;
  }

  async update(
    request: { id: string } & UpdateConfigDto,
    tx?: Prisma.TransactionClient,
  ) {
    const { id, ...data } = request;
    const result = await this.configsDb(tx).update({
      where: {
        id,
      },
      data,
    });
    return result;
  }
}
