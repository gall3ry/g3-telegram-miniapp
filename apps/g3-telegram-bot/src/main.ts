import { InlineQueryTrackerModule } from '@g3-telegram-bot/inline-query-tracker';
import { Telegraf } from 'telegraf';
import { BotApp } from './app';
import { env } from './app/env';
import { db } from './utils/db';
import { logger } from './utils/logger';

const telegraf = new Telegraf(env.BOT_TOKEN);
const modules = [
  new InlineQueryTrackerModule({
    logger,
    telegraf,
    db,
  }),
];

const app = new BotApp({ modules, telegraf });
app.launch();
