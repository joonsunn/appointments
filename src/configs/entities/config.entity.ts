import { Configs as ConfigsEntity } from 'generated/prisma';

export class Configs implements ConfigsEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startTime: string;
  endTime: string;
  maxSlots: number;
  slotDuration: number;
  timeZone: string;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}
