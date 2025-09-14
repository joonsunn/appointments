import { OffHours as OffHoursEntity } from 'generated/prisma';

export class OffHour implements OffHoursEntity {
  id: string;
  createdAt: Date;
  configId: string;
  startTime: string;
  endTime: string;
}
