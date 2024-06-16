// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import data from '@emoji-mart/data';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { getEmojiDataFromNative, init } from 'emoji-mart';

@Injectable()
export class EmojiService implements OnModuleInit {
  async onModuleInit() {
    await init({ data });
  }

  public getEmojiDataFromNative = getEmojiDataFromNative;
}
