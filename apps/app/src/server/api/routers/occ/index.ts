import { createTRPCRouter } from "../../trpc";
import { createOCC } from "./createOCC";
import { getMyOccs } from "./getMyOccs";

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
  getMyOccs,
});
