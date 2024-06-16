import { TelegramService } from '@g3-miniapp/telegram-bot-service';
import { env } from '../../../../../env';

export const telegramInstance = new TelegramService(env.BOT_TOKEN);
