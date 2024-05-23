import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { checkProof } from "./checkProof";
import { generatePayload } from "./generatePayload";

export const authRouter = createTRPCRouter({
  checkProof: checkProof,
  generatePayload: generatePayload,
  getAuthTestText: protectedProcedure.query(() => {
    return "You are authenticated!";
  }),
});
