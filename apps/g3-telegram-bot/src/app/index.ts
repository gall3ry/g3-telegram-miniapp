import { BaseModule } from '@g3-telegram-bot/types';
import { Telegraf } from 'telegraf';
import { db } from '../utils/db';
import { logger } from '../utils/logger';
import { env } from './env';

export class BotApp {
  private static instance: BotApp;
  private bot = new Telegraf(env.BOT_TOKEN);
  private modules: BaseModule[];

  constructor({ modules }: { modules: BaseModule[] }) {
    this.modules = modules;
  }

  private _initializeCommands() {
    return Promise.all(
      this.modules.map(async (module) => {
        await module.onInitializeCommands({
          bot: this.bot,
          db,
          logger,
        });

        logger.info(`🔧 Initialized commands for module ${module.name}`);
      })
    );
  }

  private async _initializeListeners() {
    return Promise.all(
      this.modules.map(async (module) => {
        await module.onInitializeListeners({
          bot: this.bot,
          db,
          logger,
        });

        logger.info(`🔧 Initialized listeners for module ${module.name}`);
      })
    );
  }

  public async launch() {
    logger.info(`🚀 Initializing bot`);

    const bot = this.bot;
    await this._initializeCommands();
    await this._initializeListeners();

    await bot.launch(undefined, () => {
      logger.info(`✅ Bot ${bot.botInfo.username} is running!`);
    });
  }
}
