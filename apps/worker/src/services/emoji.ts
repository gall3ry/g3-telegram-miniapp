import data from '@emoji-mart/data' with { type: 'json' };
import pkg from 'emoji-mart';

// import { getEmojiDataFromNative, init } from 'emoji-mart';
const { getEmojiDataFromNative, init } = pkg;

init({ data });

export class EmojiService {
  // singleton
  private static instance: EmojiService;
  private constructor() {}

  public static getInstance(): EmojiService {
    if (!EmojiService.instance) {
      EmojiService.instance = new EmojiService();
    }
    return EmojiService.instance;
  }

  public getEmojiDataFromNative = getEmojiDataFromNative;
}
