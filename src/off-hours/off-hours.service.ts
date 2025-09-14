import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOffHourDto } from './dto/create-off-hour.dto';
import { UpdateOffHourDto } from './dto/update-off-hour.dto';
import { OffDaysRepository } from './off-hours.repository';
import { ConfigsService } from 'src/configs/configs.service';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';

@Injectable()
export class OffHoursService {
  constructor(
    private readonly offHoursRepository: OffDaysRepository,
    private readonly configService: ConfigsService,
    private readonly dbService: DbService,
  ) {}

  async findAll(tx?: Prisma.TransactionClient) {
    return await this.offHoursRepository.findAll(tx);
  }

  async create(dto: CreateOffHourDto, tx?: Prisma.TransactionClient) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const config = await this.configService.findOne(tx);
      const result = await this.offHoursRepository.create(
        { ...dto, configId: config.id },
        tx,
      );

      const { startTime, endTime } = result;

      this.checkValidTime(startTime, endTime);

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
    request: { id: string } & UpdateOffHourDto,
    tx?: Prisma.TransactionClient,
  ) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const result = await this.offHoursRepository.update(request, tx);
      const { startTime, endTime } = result;
      this.checkValidTime(startTime, endTime);
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

  async remove(request: { id: string }, tx?: Prisma.TransactionClient) {
    return await this.offHoursRepository.remove(request, tx);
  }

  private checkValidTime(startTime: string, endTime: string) {
    const startTimeHHMM = startTime.split(':').map(Number);
    const endTimeHHMM = endTime.split(':').map(Number);

    if (
      endTimeHHMM[0] < startTimeHHMM[0] ||
      (endTimeHHMM[0] === startTimeHHMM[0] && endTimeHHMM[1] < startTimeHHMM[1])
    ) {
      throw new BadRequestException('endTime must be after startTime');
    }
  }

  async isOffHour(date: Date, tx?: Prisma.TransactionClient) {
    return await this.offHoursRepository.isOffHour(date, tx);
  }
}
