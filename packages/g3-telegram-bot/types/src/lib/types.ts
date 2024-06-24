import { PrismaClient } from '@gall3ry/database-client';
import { Logger } from 'pino';
import { Telegraf } from 'telegraf';

type Payload = {
  db: PrismaClient;
  logger: Logger;
  telegraf: Telegraf;
};

export abstract class BaseModule {
  name: string;
  description: string;
  logger: Logger;
  db: PrismaClient;
  bot: Telegraf;

  constructor({ telegraf, db, logger }: Payload) {
    this.logger = logger.child({ module: this.name });
    this.db = db;
    this.bot = telegraf;
  }

  abstract onInitializeListeners(): Promise<void>;
  abstract onInitializeCommands(): Promise<void>;
}
