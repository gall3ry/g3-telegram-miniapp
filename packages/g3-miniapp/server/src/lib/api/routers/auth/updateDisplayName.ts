import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';

export const updateDisplayName = protectedProcedure
  .input(
    z.object({
      displayName: z.string(),
    })
  )
  .mutation(
    async ({
      input,
      ctx: {
        session: { userId },
      },
    }) => {
      // check if display name exist
      if (
        await db.user.findFirst({ where: { displayName: input.displayName } })
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Display name already exist',
        });
      }

      await db.user.update({
        data: {
          displayName: input.displayName,
        },
        where: {
          id: userId,
        },
      });

      return {
        success: true,
      };
    }
  );
