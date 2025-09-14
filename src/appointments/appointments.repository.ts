import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Prisma } from 'generated/prisma';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly dbService: DbService) {}

  private appointmentsDb(tx?: Prisma.TransactionClient) {
    if (tx) {
      return tx.appointments;
    } else {
      return this.dbService.prisma.appointments;
    }
  }

  async create(
    dto: CreateAppointmentDto & { configId: string },
    tx?: Prisma.TransactionClient,
  ) {
    const result = await this.appointmentsDb(tx).create({
      data: dto,
    });

    return result;
  }

  async findAll(request: { configId: string }, tx?: Prisma.TransactionClient) {
    const result = await this.appointmentsDb(tx).findMany({
      where: {
        configId: request.configId,
      },
    });

    return result;
  }

  async findAllInSlot(
    request: { appointmentDateTime: Date },
    tx?: Prisma.TransactionClient,
  ) {
    const result = await this.appointmentsDb(tx).findMany({
      where: {
        appointmentDateTime: request.appointmentDateTime,
      },
    });

    return result;
  }

  async findAllOnDate(
    request: { appointmentDateTime: Date },
    tx?: Prisma.TransactionClient,
  ) {
    const { appointmentDateTime } = request;
    const startDate = new Date(appointmentDateTime);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(appointmentDateTime);
    endDate.setHours(23, 59, 59, 999);

    const result = await this.appointmentsDb(tx).findMany({
      where: {
        appointmentDateTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return result;
  }

  async findOne(request: { id: string }, tx?: Prisma.TransactionClient) {
    const { id } = request;
    const result = await this.appointmentsDb(tx).findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  async update(
    request: { id: string } & UpdateAppointmentDto,
    tx?: Prisma.TransactionClient,
  ) {
    const { id, ...data } = request;
    const result = await this.appointmentsDb(tx).update({
      where: {
        id,
      },
      data,
    });
    return result;
  }

  async remove(request: { id: string }, tx?: Prisma.TransactionClient) {
    const { id } = request;
    try {
      const result = await this.appointmentsDb(tx).delete({
        where: {
          id,
        },
      });
      return result;
    } catch {
      throw new BadRequestException('Unable to delete appointment');
    }
  }
}
