import { TelegramService } from '@g3-miniapp/telegram-bot-service';
import { env } from '@gall3ry/g3-miniapp-env';

export const telegramInstance = new TelegramService(env.BOT_TOKEN);
