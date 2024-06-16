import { z } from 'zod';
import { protectedProcedure } from '../../trpc';
import { LeaderboardService } from './getLeaderboard';

export const getMyCurrentLeaderboardPosition = protectedProcedure
  .output(
    z.object({
      avatarUrl: z.string().nullable(),
      occImageUrl: z.string(),
      rank: z.number(),
      shareCount: z.number(),
      username: z.string(),
      address: z.string(),
      occId: z.number(),
    })
  )
  .query(async ({ ctx: { session } }) => {
    const {
      rank,
      occImageUrl,
      item: { address, avatarUrl, shareCount, displayName, id: occId },
    } = await LeaderboardService.getInstance().getMyCurrentLeaderboardPosition({
      userId: session.userId,
    });

    return {
      occId,
      avatarUrl,
      occImageUrl,
      rank,
      shareCount,
      username: displayName,
      address,
    };
  });
