import { Injectable } from '@nestjs/common';
import { CreateOffDayDto } from './dto/create-off-day.dto';
import { Prisma } from 'generated/prisma';
import { OffDaysRepository } from './off-days.repository';
import { ConfigsService } from 'src/configs/configs.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class OffDaysService {
  constructor(
    private readonly offDaysRepository: OffDaysRepository,
    private readonly configService: ConfigsService,
    private readonly dbService: DbService,
  ) {}

  async findAll(tx?: Prisma.TransactionClient) {
    return await this.offDaysRepository.findAll(tx);
  }

  async findOne(request: { date: string }, tx?: Prisma.TransactionClient) {
    return await this.offDaysRepository.findOne(request, tx);
  }

  async create(request: CreateOffDayDto, tx?: Prisma.TransactionClient) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const config = await this.configService.findOne(tx);
      return await this.offDaysRepository.create(
        { ...request, configId: config.id },
        tx,
      );
    };

    if (tx) {
      return await performAction(tx);
    } else {
      return await this.dbService.prisma.$transaction((tx) => {
        return performAction(tx);
      });
    }
  }

  async remove(request: { date: string }, tx?: Prisma.TransactionClient) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const config = await this.configService.findOne(tx);
      return await this.offDaysRepository.remove(
        {
          ...request,
          configId: config.id,
        },
        tx,
      );
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
