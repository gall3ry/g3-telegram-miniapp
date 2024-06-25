import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';

export const getOcc = protectedProcedure.query(
  async ({
    ctx: {
      session: { userId },
    },
  }) => {
    const provider = await db.provider.findFirst({
      where: { userId, type: 'TON_WALLET' },
      orderBy: { createdAt: 'desc' },
    });

    if (!provider) throw new TRPCError({ code: 'NOT_FOUND' });

    const providerId = provider.id;

    const totalReaction = await db.reaction.aggregate({
      where: {
        share: {
          Sticker: {
            GMSymbolOCC: {
              Occ: {
                providerId,
              },
            },
          },
        },
      },
      _sum: {
        count: true,
      },
    });

    const reactions = await db.reaction.groupBy({
      by: ['unifiedCode'],
      where: {
        share: {
          Sticker: {
            GMSymbolOCC: {
              Occ: {
                providerId,
              },
            },
          },
        },
      },
      _count: {
        count: true,
      },
    });

    const result = await db.occ.findFirst({
      where: {
        providerId,
      },
      include: {
        Provider: {
          select: {
            User: {
              select: {
                id: true,
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!result) throw new TRPCError({ code: 'NOT_FOUND' });

    const partnerShare = await db.share.count({
      where: {
        Sticker: {
          GMSymbolOCC: {
            Occ: {
              providerId,
            },
          },
        },
      },
    });

    const {
      _sum: { shareCount },
    } = await db.sticker.aggregate({
      where: {
        GMSymbolOCC: {
          Occ: {
            providerId,
          },
        },
      },
      _sum: {
        shareCount: true,
      },
    });
    const totalShare = shareCount ?? 0;

    return {
      ...result,
      totalReaction: totalReaction._sum.count ?? 0,
      partnerShare,
      reactions,
      totalShare,
    };
  }
);
