import data from '@emoji-mart/data';
import pkg from 'emoji-mart';

// import { getEmojiDataFromNative, init } from 'emoji-mart';
const { getEmojiDataFromNative, init } = pkg;

init({ data });

export class EmojiService {
  // singleton
  private static instance: EmojiService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): EmojiService {
    if (!EmojiService.instance) {
      EmojiService.instance = new EmojiService();
    }
    return EmojiService.instance;
  }

  public getEmojiDataFromNative = getEmojiDataFromNative;
}
