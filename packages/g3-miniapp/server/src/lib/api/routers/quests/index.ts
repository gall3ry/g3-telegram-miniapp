import { QuestId, QuestStatus } from '@gall3ry/types';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { QuestService } from './services/QuestService';

export const tasksRouter = createTRPCRouter({
  getQuests: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(QuestStatus),
      })
    )
    .query(
      async ({
        input: { type },
        ctx: {
          session: { userId },
        },
      }) => {
        const tasks = await QuestService.getInstance().getTasks({
          taskType: type,
          userId,
        });

        return tasks;
      }
    ),

  completeTask: protectedProcedure
    .input(
      z.object({
        taskId: z.nativeEnum(QuestId),
      })
    )
    .mutation(
      async ({
        input: { taskId },
        ctx: {
          session: { userId },
        },
      }) => {
        await QuestService.getInstance().completeTaskOrThrow({
          taskId,
          userId,
        });

        return true;
      }
    ),
});
