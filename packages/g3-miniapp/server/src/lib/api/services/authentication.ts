import { ProviderType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { createAuthToken } from '../../ton/_utils/jwt';
import PostHogClient from './posthog';

export class AuthenticationService {
  static async createUserWithProvider({
    address,
    providerType,
  }: {
    address: string;
    providerType: ProviderType;
  }) {
    const exist = await db.provider.findFirst({
      where: { value: address, type: 'TON_WALLET' },
    });

    const client = PostHogClient();

    const provider = await db.provider.upsert({
      where: {
        type_value: {
          type: providerType,
          value: address,
        },
      },
      create: {
        type: providerType,
        value: address,
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
          address: address,
          type: providerType,
        },
      });
    } else {
      client.capture({
        distinctId: user.id.toString(),
        event: 'returning_user',
        properties: {
          address: address,
          type: providerType,
        },
      });
    }
    await client.shutdown();

    const token = await createAuthToken({
      address: address,
      provider: providerType,
      userId: user.id,
    });

    return { token };
  }
}
