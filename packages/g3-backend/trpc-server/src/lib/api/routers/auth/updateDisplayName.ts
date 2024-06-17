import { type Prisma } from '@gall3ry/shared/database-client';
import { z } from 'zod';
import { db } from '../../../db';
import { uploadToAkord, VaultName } from '../../services/akord';
import { capture } from '../../services/posthog';
import { protectedProcedure } from '../../trpc';
import { telegramInstance } from '../quests/services/telegramInstance';

export const updateDisplayName = protectedProcedure
  .input(
    z.object({
      displayName: z.string().min(5).max(50).trim().optional(),
      telegramId: z.number().optional(),
    })
  )
  .mutation(
    async ({ ctx: { session }, input: { telegramId, displayName } }) => {
      const userId = session.userId;
      const _user = await db.user.findUniqueOrThrow({ where: { id: userId } });

      void capture({
        distinctId: userId.toString(),
        event: 'update_display_name',
        properties: {
          displayName: displayName,
        },
      });

      let avatarUrl: string | null = null;

      console.log(_user);

      const shouldUpdateAvatar =
        telegramId &&
        (_user.telegramId === null ||
          (_user?.telegramId && +_user.telegramId !== telegramId));

      if (shouldUpdateAvatar) {
        const _url = await telegramInstance
          .getUserProfilePhoto({
            telegramUserId: telegramId,
          })
          .catch((e) => {
            console.log(e);
            return null;
          });

        avatarUrl = _url
          ? await uploadToAkord({
              vaultName: VaultName.AVATAR,
              url: _url,
              fileName: `avatar-${userId}`,
            })
          : null;
      }

      const toUpdate = {
        displayName: displayName,
        telegramId: telegramId?.toString(),
        avatarUrl: avatarUrl ?? undefined,
      } satisfies Prisma.UserUpdateInput;

      console.log({ toUpdate });

      if (!telegramId) delete toUpdate.telegramId;
      if (!displayName) delete toUpdate.displayName;
      if (!toUpdate.avatarUrl) delete toUpdate.avatarUrl;

      if (telegramId) {
        await db.user.updateMany({
          where: {
            telegramId: telegramId.toString(),
          },
          data: {
            telegramId: null,
          },
        });
      }

      await db.user.update({
        where: {
          id: userId,
        },
        data: toUpdate,
      });

      return {
        success: true,
      };
    }
  );
