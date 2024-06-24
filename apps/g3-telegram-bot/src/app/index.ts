import { BaseModule } from '@g3-telegram-bot/types';
import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

export class BotApp {
  private bot: Telegraf;
  private modules: BaseModule[];

  constructor({
    modules,
    telegraf,
  }: {
    modules: BaseModule[];
    telegraf: Telegraf;
  }) {
    this.modules = modules;
    this.bot = telegraf;
  }

  private _initializeCommands() {
    return Promise.all(
      this.modules.map(async (module) => {
        await module.onInitializeCommands();

        logger.info(`🔧 Initialized commands for module ${module.name}`);
      })
    );
  }

  private async _initializeListeners() {
    return Promise.all(
      this.modules.map(async (module) => {
        await module.onInitializeListeners();

        logger.info(`🔧 Initialized listeners for module ${module.name}`);
      })
    );
  }

  public async launch() {
    logger.info(`🚀 Initializing bot`);

    await this._initializeCommands();
    await this._initializeListeners();

    const bot = this.bot;
    await bot.launch(undefined, () => {
      logger.info(`✅ Bot ${bot.botInfo.username} is running!`);
    });
  }
}
