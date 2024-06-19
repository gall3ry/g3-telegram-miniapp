import { Prisma } from '@gall3ry/database-client';
import { ErrorMessage } from '@gall3ry/types';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';

class GetCurrentUserService {
  static readonly _defaultSelectUser = {
    id: true,
    point: true,
    displayName: true,
    avatarUrl: true,
    telegramId: true,
    countryCode: true,
    Provider: {
      select: {
        id: true,
        type: true,
        value: true,
      },
    },
  } satisfies Prisma.UserSelect;
}


export const getCurrentUser = protectedProcedure.query(
  async ({ ctx: { session, headers } }) => {
    const userId = session.userId;

    const user = await db.user
      .findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: GetCurrentUserService._defaultSelectUser,
      })
      .catch((error) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: ErrorMessage.UserNotFound,
          });
        }

        throw error;
      });

    if (!user.countryCode) {
      // Currently we use Vercel as our serverless provider for Frontend
      // https://vercel.com/guides/geo-ip-headers-geolocation-vercel-functions
      const countryCode = headers['x-vercel-ip-country'] as string;
      // countryCode = 'VN';
      console.log('countryCode', countryCode);
      if (countryCode) {
        console.log(`Update user countryCode: ${countryCode}`);
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            countryCode,
          },
        });
      }
    }

    return user;
  }
);
