import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { ConfigsService } from 'src/configs/configs.service';
import { OffDaysService } from 'src/off-days/off-days.service';
import { OffHoursService } from 'src/off-hours/off-hours.service';

@Injectable()
export class SlotsService {
  constructor(
    private readonly configService: ConfigsService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly offDaysService: OffDaysService,
    private readonly offHoursService: OffHoursService,
  ) {}

  async findAllOnDate(dateInput: string) {
    const date = new Date(dateInput);
    const config = await this.configService.findOne();
    if (!config) {
      return [];
    }

    // 1. Check if the day is a configured off-day (e.g., Sunday)
    const day = date.getDay();
    const dayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };
    if (!config[dayMap[day] as keyof typeof config]) {
      return []; // It's a day off
    }

    // 2. Check if the date is a registered holiday
    const dateString = date.toISOString().split('T')[0];
    const isHoliday = await this.offDaysService.findOne({ date: dateString });
    if (isHoliday) {
      return []; // It's a holiday
    }

    // 3. Get all appointments for the day to check against
    const appointments = await this.appointmentsService.findAllOnDate({
      appointmentDateTime: date,
    });

    const slots: {
      date: string;
      time: string;
      available_slots: number;
    }[] = [];
    const { startTime, endTime, slotDuration, maxSlots } = config;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    const currentTime = new Date(startDate);

    while (currentTime < endDate) {
      const isOffHour = await this.offHoursService.isOffHour(currentTime);
      if (!isOffHour) {
        const bookedCount = appointments.filter(
          (appt) =>
            new Date(appt.appointmentDateTime).getTime() ===
            currentTime.getTime(),
        ).length;

        const time = currentTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });

        slots.push({
          date: dateString,
          time,
          available_slots: maxSlots - bookedCount,
        });
      }

      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    return slots;
  }
}
