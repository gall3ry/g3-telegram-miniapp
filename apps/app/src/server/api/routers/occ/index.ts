import { createTRPCRouter } from "../../trpc";
import { createOCC } from "./createOCC";
import { getMyOccs } from "./getMyOccs";
import { getOcc } from "./getOcc";
import { getOccTemplate, getOccTemplates } from "./getOccTemplates";
import { getSharedPosts } from "./getSharedPost";

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
  getMyOccs,
  getSharedPosts,
  getEpicTemplates: getOccTemplates,
  getEpicTemplate: getOccTemplate,
  getOcc: getOcc,
});
