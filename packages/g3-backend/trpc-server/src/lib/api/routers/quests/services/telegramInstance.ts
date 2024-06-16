import { env } from '../../../../env';
import { TelegramService } from '../../../services/telegram';

export const telegramInstance = new TelegramService(env.BOT_TOKEN);
