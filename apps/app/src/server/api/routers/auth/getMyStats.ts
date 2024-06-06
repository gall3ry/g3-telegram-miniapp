import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

export const getMyStats = protectedProcedure.query(
  async ({ ctx: { session } }) => {
    // total share, total reactions, total minted
    const userId = session.userId;

    const [totalShare, totalReaction, totalMinted] = await Promise.all([
      db.share.count({
        where: {
          occ: {
            userId: userId,
          },
        },
      }),
      db.share
        .aggregate({
          where: {
            occ: {
              userId: userId,
            },
          },
          _sum: {
            reactionCount: true,
          },
        })
        .then((res) => res._sum.reactionCount ?? 0),
      db.occ.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    return {
      totalShare,
      totalReaction,
      totalMinted,
    };
  },
);
