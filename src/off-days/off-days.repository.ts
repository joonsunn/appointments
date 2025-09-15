import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Prisma } from 'generated/prisma';
import { CreateOffDayDto } from './dto/create-off-day.dto';

@Injectable()
export class OffDaysRepository {
  constructor(private readonly dbService: DbService) {}

  private offDaysDb(tx?: Prisma.TransactionClient) {
    if (tx) {
      return tx.offDays;
    } else {
      return this.dbService.prisma.offDays;
    }
  }

  async findAll(tx?: Prisma.TransactionClient) {
    return await this.offDaysDb(tx).findMany();
  }

  async findOne(request: { date: string }, tx?: Prisma.TransactionClient) {
    return await this.offDaysDb(tx).findFirst({
      where: { date: request.date },
    });
  }

  async create(
    dto: CreateOffDayDto & { configId: string },
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const result = await this.offDaysDb(tx).create({
        data: dto,
      });

      return result;
    } catch {
      throw new BadRequestException('Unable to create off day');
    }
  }

  async remove(
    request: { configId: string; date: string },
    tx?: Prisma.TransactionClient,
  ) {
    const { configId, date } = request;
    try {
      const result = await this.offDaysDb(tx).delete({
        where: {
          configId_date: {
            configId,
            date,
          },
        },
      });
      return result;
    } catch {
      throw new BadRequestException('Unable to delete off day');
    }
  }
}
