import { createTRPCRouter } from "../../trpc";
import { createOCC } from "./createOCC";
import { getMyOccs } from "./getMyOccs";
import { getSharedPosts } from "./getSharedPost";

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
  getMyOccs,
  getSharedPosts,
});
