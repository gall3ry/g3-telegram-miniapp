export class StickerService {
  private static instance: StickerService;

  public static getInstance(): StickerService {
    if (!StickerService.instance) {
      StickerService.instance = new StickerService();
    }

    return StickerService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}
