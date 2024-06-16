import { InlineQueryTrackerModule } from '@g3-telegram-bot/inline-query-tracker';
import { BotApp } from './app';

const modules = [new InlineQueryTrackerModule()];

const app = new BotApp({ modules });
app.launch();
