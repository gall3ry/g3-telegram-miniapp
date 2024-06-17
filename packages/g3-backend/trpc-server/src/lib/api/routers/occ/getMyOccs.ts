import { Prisma } from '@gall3ry/shared/database-client';
import groupBy from 'lodash.groupby';
import { z } from 'zod';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';

export type Dictionary<T> = Record<string, T>;

export class ReactionService {
  // singleton
  private static instance: ReactionService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): ReactionService {
    if (!ReactionService.instance) {
      ReactionService.instance = new ReactionService();
    }

    return ReactionService.instance;
  }

  async getReactions(occIds: number[]): Promise<
    Record<
      number,
      {
        occId: number;
        unifiedCode: string;
        count: number;
      }[]
    >
  > {
    const occList = await db.occ.findMany({
      where: {
        id: {
          in: occIds,
        },
      },
      include: {
        GMSymbolOCC: {
          select: {
            Sticker: {
              include: {
                Share: {
                  include: {
                    Reaction: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (occList.length === 0) {
      return {};
    }

    const result = await db.$queryRaw<
      Record<
        string,
        {
          occId: number;
          unifiedCode: string;
          count: number;
        }
      >
    >`
      SELECT "occId", "unifiedCode", SUM(count) as count FROM "Reaction"
      JOIN "Share" ON "Reaction"."shareId" = "Share"."id"
      JOIN "Sticker" ON "Share"."stickerId" = "Sticker"."id"
      JOIN "GMSymbolOCC" ON "Sticker"."gMSymbolOCCId" = "GMSymbolOCC"."id"
      WHERE "occId" IN (${Prisma.join(occIds)})
      GROUP BY "occId", "unifiedCode"
    `;

    return groupBy(result, 'occId');
  }
}

export const getMyOccs = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().default(10),
    })
  )
  .query(async ({ input, ctx: { session } }) => {
    const where = {
      Provider: { userId: session.userId },
    } satisfies Prisma.OccWhereInput;

    const [occs, total] = await Promise.all([
      db.occ.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        where,
      }),
      db.occ.count({ where }),
    ]);

    const reactions = await ReactionService.getInstance().getReactions(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      occs.map((occ) => occ.id)
    );

    return {
      occs: await Promise.all(
        occs.map(async (occ) => {
          const totalShare = await db.share.aggregate({
            _count: {
              _all: true,
            },
            where: {
              Sticker: {
                GMSymbolOCC: {
                  occId: occ.id,
                },
              },
            },
          });

          return {
            ...occ,
            reactions: reactions[occ.id],
            totalShare: totalShare._count._all,
          };
        })
      ),
      total,
    };
  });

export const getTopOccs = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().default(10),
    })
  )
  .query(async ({ input }) => {
    console.log(`getTopOccs: ${input.page} ${input.limit}`);
    const occs = await db.occ.findMany({
      take: input.limit,
      skip: (input.page - 1) * input.limit,
      orderBy: {
        shareCount: 'desc',
      },
    });
    console.log(`getTopOccs: ${occs.length}`);
    return { occs };
  });
