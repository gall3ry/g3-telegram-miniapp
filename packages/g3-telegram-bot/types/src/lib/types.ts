import { PrismaClient } from '@gall3ry/database-client';
import { Logger } from 'pino';
import { Telegraf } from 'telegraf';

type Payload = {
  bot: Telegraf;
  db: PrismaClient;
  logger: Logger;
};

export abstract class BaseModule {
  name: string;
  description: string;

  abstract onInitializeListeners(payload: Payload): Promise<void>;
  abstract onInitializeCommands(payload: Payload): Promise<void>;
}
