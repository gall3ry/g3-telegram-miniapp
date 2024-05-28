import { type Prisma } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

class ReactionService {
  // singleton
  private static instance: ReactionService;
  private constructor() {}

  public static getInstance(): ReactionService {
    if (!ReactionService.instance) {
      ReactionService.instance = new ReactionService();
    }

    return ReactionService.instance;
  }

  async sumarizeReactions(occIds: number[]) {
    const shareList = await db.share.findMany({
      where: {
        occId: {
          in: occIds,
        },
      },
    });

    shareList.map((share) => {
      const reactions = (share.reactionMetadata as any)?.reactions as any[];

      console.log(reactions);

      // reaction by types
      // const reactionByType = reactions.reduce((acc, reaction) => {
      //   acc[reaction.type] = acc[reaction.type] || 0;
      //   acc[reaction.type] += 1

      //   return acc;
      // }

      // Object.entries(reactions).map(([reaction, data]) => {
      //   console.log(reaction, data);
      // });

      // reactions.map((reaction) => {
      //   console.log(reaction);
      // });

      return {
        ...share,
      };
    });
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
          _count: { select: { Share: true } },
        },
      }),
      db.occ.count({ where }),
    ]);

    return {
      occs,
      total,
      sumarizedReactions: await ReactionService.getInstance().sumarizeReactions(
        occs.map((occ) => occ.id),
      ),
    };
  });
