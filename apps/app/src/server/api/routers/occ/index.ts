import { createTRPCRouter } from "../../trpc";
import { createOCC } from "./createOCC";
import { getMyOccs } from "./getMyOccs";
import { getOcc } from "./getOcc";
import { getOccTemplate, getOccTemplates } from "./getOccTemplates";

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
  getMyOccs,
  getEpicTemplates: getOccTemplates,
  getEpicTemplate: getOccTemplate,
  getOcc: getOcc,
});
