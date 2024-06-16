import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import input from 'input';
import { groupBy, mapValues } from 'lodash-es';
import { Api, TelegramClient } from 'telegram';

export interface Dictionary<T> {
  [index: string]: T;
}

@Injectable()
export class TelegramService implements OnModuleInit {
  private telegramClient: TelegramClient;

  constructor(private configService: ConfigService) {
    const apiId = this.configService.get<number>('TELEGRAM_API_ID');
    const apiHash = this.configService.get<string>('TELEGRAM_API_HASH');
    const stringSession = this.configService.get<string>(
      'TELEGRAM_STRING_SESSION'
    );

    this.telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
  }

  async onModuleInit() {
    await this._initialize();
  }

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
