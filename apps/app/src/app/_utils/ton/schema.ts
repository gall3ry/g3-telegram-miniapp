import { z } from "zod";

export const schema = z.object({
  transaction: z.object({
    account: z.object({
      address: z.string(),
      is_scam: z.boolean(),
      is_wallet: z.boolean(),
    }),
  }),
  interfaces: z.array(z.literal("wallet_v4r2")),
  children: z
    .array(
      z.object({
        interfaces: z.array(z.literal("nft_collection")),
        children: z
          .array(
            z.object({
              transaction: z.object({
                account: z.object({
                  address: z.string(),
                  is_scam: z.boolean(),
                  is_wallet: z.boolean(),
                }),
              }),
              interfaces: z.array(z.literal("nft_item")),
            }),
          )
          .min(1)
          .max(1),
      }),
    )
    .min(1)
    .max(1),
});
