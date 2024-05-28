import { type Prisma } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";
import { ReactionService } from "./getMyOccs";

export const getSharedPosts = protectedProcedure
  .input(
    z.object({
      occId: z.coerce.number(),
    }),
  )
  .query(async ({ input: { occId } }) => {
    const where = {
      occId,
    } satisfies Prisma.ShareWhereInput;

    const [shareList, total] = await Promise.all([
      db.share.findMany({
        where,
      }),
      db.share.count({ where }),
    ]);

    const reactionService = ReactionService.getInstance();
    const summaries = await reactionService.sumarizeReactionByShareIds(
      shareList.map((share) => share.id),
    );

    return {
      shareList: shareList.map((share) => ({
        ...share,
        sumarizedReactions: summaries[share.id]?.[0]?.reactionByType,
      })),
      total,
    };
  });
