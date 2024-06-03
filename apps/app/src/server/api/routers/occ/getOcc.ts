import { z } from "zod";
import { db } from "../../../db";
import { publicProcedure } from "../../trpc";

export const getOcc = publicProcedure
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .query(async ({ input: { id } }) => {
    return db.occ.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            avatarUrl: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            Share: true,
          },
        },
      },
    });
  });
