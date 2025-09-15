import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import { Configs, Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { ConfigsService } from 'src/configs/configs.service';
import { OffDaysService } from 'src/off-days/off-days.service';
import { OffHoursService } from 'src/off-hours/off-hours.service';
import { dayjs } from 'src/lib/dayjs';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly configService: ConfigsService,
    private readonly dbService: DbService,
    private readonly offDaysService: OffDaysService,
    private readonly offHoursService: OffHoursService,
  ) {}

  async create(request: CreateAppointmentDto, tx?: Prisma.TransactionClient) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const config = await this.configService.findOne(tx);
      const correctedTime = await this.validateRequest({ ...request, config });

      return await this.appointmentRepository.create(
        { appointmentDateTime: correctedTime, configId: config.id },
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

  async findAll(tx?: Prisma.TransactionClient) {
    const performAction = async (tx?: Prisma.TransactionClient) => {
      const config = await this.configService.findOne(tx);
      return await this.appointmentRepository.findAll(
        { configId: config.id },
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

  async findAllInSlot(
    request: {
      appointmentDateTime: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return await this.appointmentRepository.findAllInSlot(request, tx);
  }

  async findAllOnDate(
    request: {
      appointmentDateTime: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return await this.appointmentRepository.findAllOnDate(request, tx);
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    return await this.appointmentRepository.findOne({ id }, tx);
  }

  async update(
    request: {
      id: string;
    } & UpdateAppointmentDto,
    tx?: Prisma.TransactionClient,
  ) {
    return await this.appointmentRepository.update(request, tx);
  }

  async remove(request: { id: string }, tx?: Prisma.TransactionClient) {
    return await this.appointmentRepository.remove(request, tx);
  }

  async validateRequest(request: {
    appointmentDateTime: Date;
    config: Configs;
  }) {
    const { appointmentDateTime, config } = request;
    const zonedAppointmentDateTime = dayjs.tz(
      appointmentDateTime,
      config.timeZone,
    );
    const nearestSlot = this.findNearestSlot({
      appointmentDateTime: zonedAppointmentDateTime.toDate(),
      config,
    });

    const zonedNearestSlot = dayjs.tz(nearestSlot, config.timeZone);
    const day = zonedNearestSlot.day();
    const dayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };

    if (!config[dayMap[day] as keyof Configs]) {
      throw new BadRequestException('Off day');
    }

    const date = zonedNearestSlot.format('YYYY-MM-DD');
    const isHoliday = await this.offDaysService.findOne({ date });
    if (isHoliday) {
      throw new BadRequestException('Off day');
    }

    const isOffHour = await this.offHoursService.isOffHour(
      zonedNearestSlot.toDate(),
    );
    if (isOffHour) {
      throw new BadRequestException('Off hour');
    }

    const [startHour, startMinute] = config.startTime.split(':').map(Number);
    const [endHour, endMinute] = config.endTime.split(':').map(Number);

    const slotTime = zonedNearestSlot;
    const startOfDay = zonedNearestSlot
      .hour(startHour)
      .minute(startMinute)
      .second(0)
      .millisecond(0);
    const endOfDay = zonedNearestSlot
      .hour(endHour)
      .minute(endMinute)
      .second(0)
      .millisecond(0);

    if (slotTime.isBefore(startOfDay) || slotTime.isSameOrAfter(endOfDay)) {
      throw new BadRequestException('Outside operating hours');
    }

    const allAppointmentsInSlot = await this.findAllInSlot({
      appointmentDateTime: nearestSlot,
    });
    if (allAppointmentsInSlot.length >= config.maxSlots) {
      throw new BadRequestException('Slot not available');
    }

    return nearestSlot;
  }

  findNearestSlot(request: { appointmentDateTime: Date; config: Configs }) {
    const { slotDuration, timeZone } = request.config;
    const slotDurationMs = slotDuration * 60 * 1000; // convert minutes to milliseconds

    const zonedAppointmentDateTime = dayjs.tz(
      request.appointmentDateTime,
      timeZone,
    );
    const appointmentTime = zonedAppointmentDateTime.valueOf();

    const nearestSlotTime =
      Math.round(appointmentTime / slotDurationMs) * slotDurationMs;

    const nearestSlot = dayjs.tz(nearestSlotTime, timeZone);

    return nearestSlot.toDate();
  }
}
