import input from 'input';
import { groupBy, mapValues } from 'lodash-es';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession.js';

export const apiId = 25258261;
export const apiHash = 'ecdcb0e838175aee63d57acdbf9c76b0';
export const stringSession = new StringSession(
  '1BQANOTEuMTA4LjU2LjE5NQG7EH4ndUJu7FYpz68jEA/RKE017/YDig10mXNhCYtRoA11ao3oRclhVwuUS3mzQOrOdxCDW3SKQsJZHkIthehAnK0f97jzIaELlXboJyHenYMEOm1Dp7XkxY5LUjfB5k6VwW65cSDhDf6fdJTzMEr/Ka9RwqY7eBFqpr+PJx+YkLdxUc+m6MpGeOeJcYgSBgRbvitEtszvFBtK2entvRAs85iQYNwdWFvIoLQR61MFCbcULTHZoomov81+obBPCtXgNoNfdlP6dYpkJEblMi+VY4yF6XTEmWZ0iufPruI55d0muyF8dvGeJAyvmWL5T+kYGCmO2CRmyzRbj8wzthOPbQ==',
);

export interface Dictionary<T> {
  [index: string]: T;
}

export class TelegramService {
  // singleton
  private static instance: TelegramService;

  private telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

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
      }),
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
              },
            ),
          };
        } else {
          console.error('Unknown update', update);
          return null;
        }
      }),
      'msgId',
    );

    return results;
  }
}
