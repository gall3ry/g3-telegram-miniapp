import { z } from 'zod';
import { stickerResultSchema } from './stickerResultSchema';

describe('stickerResultSchema', () => {
  it('should validate a valid sticker result', () => {
    console.log(
      stickerResultSchema.parse({
        id: 9,
        stickerType: 'GM1',
        extra: { epicSaved: 0, imageUrl: 'https://picsum.com' },
        User: { id: 1, username: 'pnpminstall' },
        shareCount: 0,
        telegramFileId: null,
        createdAt: new Date('2024-06-28T04:49:42.000Z'),
        templateMetadata: null,
      } satisfies z.input<typeof stickerResultSchema>)
    );
  });
});
