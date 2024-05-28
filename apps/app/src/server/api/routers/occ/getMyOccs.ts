import { type Prisma } from "database";
import { groupBy } from "lodash-es";
import { z } from "zod";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

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

  async sumarizeReactions(occIds: number[]): Promise<
    Dictionary<
      {
        occId: number;
        reactionByType: Record<string, number>;
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
        Share: true,
      },
    });

    return groupBy(
      occList.map((occ) => {
        const shareList = occ.Share;

        const reactionByType = shareList.reduce(
          (acc, share) => {
            const reactions = (share.reactionMetadata as any)
              ?.reactions as any[];

            for (const [key, value] of Object.entries(reactions)) {
              if (!acc[key]) {
                acc[key] = 0;
              }

              acc[key] += value.count;
            }

            return acc;
          },
          {} as Record<string, number>,
        );

        return {
          occId: occ.id,
          reactionByType,
        };
      }),
      "occId",
    );
  }

  async sumarizeReactionByShareIds(shareIds: number[]): Promise<
    Dictionary<
      {
        shareId: number;
        reactionByType: any;
      }[]
    >
  > {
    const shareList = await db.share.findMany({
      where: {
        id: {
          in: shareIds,
        },
      },
    });

    return groupBy(
      shareList.map((share) => {
        const reactions = (share.reactionMetadata as any)?.reactions as any[];

        const reactionByType: Record<string, number> = {};
        for (const [key, value] of Object.entries(reactions)) {
          console.log(key, value);

          if (!reactionByType[key]) {
            reactionByType[key] = 0;
          }

          reactionByType[key] += value.count;
        }

        return {
          shareId: share.id,
          reactionByType,
        };
      }),
      "shareId",
    );
  }
}

export const getMyOccs = protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
    }),
  )
  .query(async ({ input, ctx: { session } }) => {
    const where = {
      userId: session.userId,
    } satisfies Prisma.OccWhereInput;

    const [occs, total] = await Promise.all([
      db.occ.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        where,
        include: {
          _count: {
            select: {
              Share: true,
            },
          },
        },
      }),
      db.occ.count({ where }),
    ]);

    const summaries = await ReactionService.getInstance().sumarizeReactions(
      occs.map((occ) => occ.id),
    );

    return {
      occs: occs.map((occ) => {
        return {
          ...occ,
          sumarizedReactions: summaries[occ.id]?.[0]?.reactionByType,
        };
      }),
      total,
    };
  });
