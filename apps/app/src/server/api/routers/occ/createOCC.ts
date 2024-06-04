import { z } from "zod";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

class OccCreationService {
  private static instance: OccCreationService;
  private constructor() {}

  public static getInstance(): OccCreationService {
    if (!OccCreationService.instance) {
      OccCreationService.instance = new OccCreationService();
    }

    return OccCreationService.instance;
  }

  public async getTx(txHash: string) {
    // fetch tx from blockchain

    return {
      nftId: 123,
      nftContract: "0x123",
      nftOwner: "0x123",
    };
  }
}

// move to worker (later)
export const createOCC = protectedProcedure
  .input(
    z.object({
      occTemplateId: z.number(),
      txHash: z.string(),
    }),
  )
  .mutation(async ({ ctx: { session }, input: { occTemplateId } }) => {
    const occ = await db.occ.create({
      data: {
        userId: session.userId,
        occTemplateId,
      },
    });

    return {
      id: occ.id,
    };
  });
