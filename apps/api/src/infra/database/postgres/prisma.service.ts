import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'info' },
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ]
          : [{ emit: 'stdout', level: 'error' }],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      const dbUrl = process.env.DATABASE_URL || '';
      const poolMatch = dbUrl.match(/connection_limit=(\d+)/);
      const poolSize = poolMatch ? poolMatch[1] : 'default';
      this.logger.log(`[Prisma Pool] Configured pool size: ${poolSize}`);
      this.logger.log(' Connected to PostgreSQL (Supabase) via Prisma ORM');
    } catch (error: any) {
      this.logger.error(` Error connecting to PostgreSQL: ${error?.message || error}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log(' Disconnected from PostgreSQL (Supabase)');
  }
}