import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { occRouter } from "./routers/occ";
import { tasksRouter } from "./routers/quests";
import { rewardRouter } from "./routers/reward";
import { stickerRouter } from "./routers/sticker";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  reward: rewardRouter,
  occ: occRouter,
  quests: tasksRouter,
  sticker: stickerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
