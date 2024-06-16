import input from 'input';
import { groupBy, mapValues } from 'lodash-es';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession';
import { env } from './env';

export const apiId = env.TELEGRAM_API_ID;
export const apiHash = env.TELEGRAM_API_HASH;
export const stringSession = new StringSession(env.TELEGRAM_STRING_SESSION);

export interface Dictionary<T> {
  [index: string]: T;
}

export class TelegramService {
  // singleton
  private static instance: TelegramService;

  private telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private async _initialize() {
    if (this.telegramClient.connected) {
      return;
    }

    console.log(`🚀 Initializing Telegram client...`);
    await this.telegramClient.start({
      phoneNumber: async () => await input.text('Please enter your number: '),
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () =>
        await input.text('Please enter the code you received: '),
      onError: (err) => console.log(err),
    });

    console.log(`🚀 Telegram client is ready!`);
  }

  public static async getInstance() {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
      await TelegramService.instance._initialize();
    }
    return TelegramService.instance;
  }

  async getReactionsByIds({
    groupName,
    ids,
  }: {
    groupName: string;
    ids: number[];
  }): Promise<
    Dictionary<
      {
        msgId: number;
        reactions: {
          [x: string]: Api.ReactionCount;
        };
      }[]
    >
  > {
    const reactions = (await this.telegramClient.invoke(
      new Api.messages.GetMessagesReactions({
        id: ids,
        peer: groupName,
      })
    )) as unknown as Api.Updates;

    const results = groupBy(
      reactions.updates.map((update) => {
        if (update instanceof Api.UpdateMessageReactions) {
          return {
            msgId: update.msgId,
            reactions: mapValues(
              groupBy(update.reactions.results, 'reaction.emoticon'),
              (reactions) => {
                return reactions[0];
              }
            ),
          };
        } else {
          console.error('Unknown update', update);
          return null;
        }
      }),
      'msgId'
    );

    return results;
  }
}
