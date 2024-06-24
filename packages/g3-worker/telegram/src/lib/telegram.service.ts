import { Inject, Injectable, Logger } from '@nestjs/common';
import input from 'input';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { ConfigModuleOptions } from './telegram-module-options.interface';
import { MODULE_OPTIONS_TOKEN } from './telegram.module-definition';

export interface Dictionary<T> {
  [index: string]: T;
}

@Injectable()
export class TelegramService {
  private telegramClient: TelegramClient;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: ConfigModuleOptions
  ) {
    const { apiId, apiHash } = options;
    const stringSession = new StringSession(options.stringSession);

    this.telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    this._initialize()
      .then(() => {
        Logger.log('Telegram client started successfully');
      })
      .catch((error) => {
        Logger.error('Failed to start Telegram client', error);
      });
  }

  private async _initialize() {
    if (this.telegramClient.connected) {
      return;
    }

    console.log(`🚀 Starting telegram client`);

    await this.telegramClient.start({
      phoneNumber: async () => await input.text('Please enter your number: '),
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () =>
        await input.text('Please enter the code you received: '),
      onError: (err) => {
        console.log(`Error: ${err}`);
      },
    });

    console.log(this.telegramClient.session.save());

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
    if (!this.telegramClient.connected) {
      await this._initialize();
    }

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
