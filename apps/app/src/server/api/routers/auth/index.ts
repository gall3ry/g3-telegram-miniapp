import { createTRPCRouter } from "../../trpc";
import { checkProof } from "./checkProof";
import { generatePayload } from "./generatePayload";

export const authRouter = createTRPCRouter({
  checkProof: checkProof,
  generatePayload: generatePayload,
});
