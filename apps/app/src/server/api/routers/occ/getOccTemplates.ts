import { type Prisma } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { publicProcedure } from "../../trpc";

export const getOccTemplates = publicProcedure
  .input(
    z.object({
      limit: z.number().default(10),
      page: z.number().default(1),
    }),
  )
  .query(async ({ input: { limit, page } }) => {
    const where = {} as Prisma.OccTemplateWhereInput;
    const [items, total] = await Promise.all([
      db.occTemplate.findMany({
        where: where,
        take: limit,
        skip: (page - 1) * limit,
        include: {
          _count: {
            select: { Occ: true },
          },
        },
      }),
      db.occTemplate.count({
        where: where,
      }),
    ]);

    return {
      items,
      total,
    };
  });

export const getOccTemplate = publicProcedure
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .query(async ({ input: { id } }) => {
    return db.occTemplate.findUnique({
      where: { id },
    });
  });
