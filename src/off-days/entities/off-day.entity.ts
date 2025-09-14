import { OffDays as OffDaysEntity } from 'generated/prisma';

export class OffDays implements OffDaysEntity {
  id: string;
  createdAt: Date;
  configId: string;
  date: string;
}
