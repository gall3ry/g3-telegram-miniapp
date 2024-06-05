import { makeApi } from "@zodios/core";
import z from "zod";

export const nftDataApi = makeApi([
  {
    method: "get",
    path: "/nft-data/:txHash",
    alias: "getNFTData",
    description: "Get NFT data by txHash",
    response: z.object({
      owner: z.string(),
      nftAddress: z.string(),
    }),
    parameters: [
      {
        name: "txHash",
        type: "Path",
        schema: z.string(),
        description: "Transaction hash",
      },
    ],
    errors: [
      {
        schema: z.object({ message: z.string() }),
        status: 404,
      },
      {
        schema: z.object({ message: z.string() }),
        status: 500,
      },
    ],
  },
]);
