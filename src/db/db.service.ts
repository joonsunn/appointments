import {
  Injectable,
  type OnApplicationShutdown,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

@Injectable()
export class DbService
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private readonly _prisma: PrismaClient = (() => {
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
    });

    return prisma;
  })();

  get prisma(): PrismaClient {
    return this._prisma;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this._prisma.$connect();
      console.log(`Connected to database successfully`);
    } catch (error) {
      console.log(`Failed to connect to database`);
      throw error;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this._prisma.$disconnect();
    console.log(`Database disconnected successfully`);
  }

  async onModuleDestroy(): Promise<void> {
    await this._prisma.$disconnect();
    console.log(`Database disconnected successfully`);
  }
}
