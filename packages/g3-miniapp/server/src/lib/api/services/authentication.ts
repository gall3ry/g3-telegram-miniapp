import { ProviderType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { createAuthToken } from '../../ton/_utils/jwt';
import PostHogClient from './posthog';

export class AuthenticationService {
  static async upsertUserWithProvider({
    value,
    providerType,
  }: {
    value: string;
    providerType: ProviderType;
  }) {
    const exist = await db.provider.findFirst({
      where: { value: value, type: 'TON_WALLET' },
    });

    const client = PostHogClient();

    const provider = await db.provider.upsert({
      where: {
        type_value: {
          type: providerType,
          value: value,
        },
      },
      create: {
        type: providerType,
        value: value,
        User: {
          create: {},
        },
      },
      update: {},
      include: {
        User: true,
      },
    });

    const user = provider.User;
    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No user associated with this address',
      });
    }

    if (!exist) {
      client.capture({
        distinctId: user.id.toString(),
        event: 'new_user',
        properties: {
          address: value,
          type: providerType,
        },
      });
    } else {
      client.capture({
        distinctId: user.id.toString(),
        event: 'returning_user',
        properties: {
          address: value,
          type: providerType,
        },
      });
    }
    await client.shutdown();

    const token = await createAuthToken({
      address: value,
      provider: providerType,
      userId: user.id,
    });

    return { token, userId: user.id };
  }

  // connectProvider
  static async connectProvider({
    value,
    providerType,
    userId,
  }: {
    value: string;
    providerType: ProviderType;
    userId: number;
  }) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found',
      });
    }

    const provider = await db.provider.upsert({
      where: {
        type_value: {
          type: providerType,
          value: value,
        },
      },
      create: {
        type: providerType,
        value: value,
        User: {
          connect: {
            id: userId,
          },
        },
      },
      update: {
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return provider;
  }
}
