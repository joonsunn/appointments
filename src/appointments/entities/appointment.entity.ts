import { Appointments as AppointmentsEntity } from 'generated/prisma';

export class Appointment implements AppointmentsEntity {
  id: string;
  appointmentDateTime: Date;
  configId: string;
  createdAt: Date;
  updatedAt: Date;
}
