import { createTRPCRouter } from "../../trpc";
import { createOCC } from "./createOCC";
import { getLeaderboard } from "./getLeaderboard";
import { getMyCurrentLeaderboardPosition } from "./getMyCurrentLeaderboardPosition";
import { getMyOccs, getTopOccs } from "./getMyOccs";
import { getOcc } from "./getOcc";

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
  getMyOccs,
  getTopOccs,
  getOcc: getOcc,
  getLeaderboard,
  getMyCurrentLeaderboardPosition,
});
