import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Prisma } from 'generated/prisma';
import { CreateOffHourDto } from './dto/create-off-hour.dto';

@Injectable()
export class OffDaysRepository {
  constructor(private readonly dbService: DbService) {}

  private offHoursDb(tx?: Prisma.TransactionClient) {
    if (tx) {
      return tx.offHours;
    } else {
      return this.dbService.prisma.offHours;
    }
  }

  async findAll(tx?: Prisma.TransactionClient) {
    return await this.offHoursDb(tx).findMany();
  }

  async isOffHour(date: Date, tx?: Prisma.TransactionClient) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    const result = await this.offHoursDb(tx).findFirst({
      where: {
        startTime: {
          lte: time,
        },
        endTime: {
          gt: time,
        },
      },
    });
    return result !== null;
  }

  async create(
    dto: CreateOffHourDto & { configId: string },
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const result = await this.offHoursDb(tx).create({
        data: dto,
      });

      return result;
    } catch {
      throw new BadRequestException('Unable to create off hours');
    }
  }

  async update(
    request: { id: string } & Prisma.OffHoursUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const result = await this.offHoursDb(tx).update({
        where: {
          id: request.id,
        },
        data: request,
      });

      return result;
    } catch {
      throw new BadRequestException('Unable to update off hours');
    }
  }

  async remove(request: { id: string }, tx?: Prisma.TransactionClient) {
    const { id } = request;
    try {
      const result = await this.offHoursDb(tx).delete({
        where: {
          id,
        },
      });
      return result;
    } catch {
      throw new BadRequestException('Unable to delete off hours');
    }
  }
}
