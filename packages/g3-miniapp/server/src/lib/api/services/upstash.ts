import { env } from '@gall3ry/g3-miniapp-env';
import {
  Client,
  PublishRequest,
  PublishToUrlResponse,
  State,
} from '@upstash/qstash';
import { Redis } from '@upstash/redis';
import axios from 'axios';

export enum Key {
  LEADERBOARD = 'leaderboard',
  getGMNFTs = 'getGMNFTs',
}

const mapCacheKeyToTimeExpiry: Record<Key, number> = {
  [Key.LEADERBOARD]: 60,
  [Key.getGMNFTs]: 5,
};

const dynamicCacheKey = {
  [Key.LEADERBOARD]: () => 'leaderboard',
  [Key.getGMNFTs]: ({ userId }: { userId: number }) => `getGMNFTs-${userId}`,
} satisfies Record<Key, (args: any) => string>;

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const qstash = new Client({
  token: env.UPSTASH_QSTASH_TOKEN,
});

export const callOrGetFromCache = async <T, D extends Key>(
  key: D,
  callback: () => Promise<T>,
  args: Parameters<(typeof dynamicCacheKey)[D]>['0']
): Promise<T> => {
  if (env.NEXT_PUBLIC_G3_ENV === 'development') {
    return callback();
  }

  const cacheKey = dynamicCacheKey[key]({
    // no way to make it, but we have typesafe already at args
    ...(args as any),
  });
  const cacheValue = await redis.get(cacheKey);
  if (cacheValue) {
    return cacheValue as T;
  }

  const value = await callback();
  await redis.setex(cacheKey, mapCacheKeyToTimeExpiry[key], value);
  return value;
};

export const publish = async <T>(request: PublishRequest<T>) => {
  if (env.NODE_ENV === 'development') {
    if (!request?.url) {
      throw new Error('request.url is required');
    }

    void axios.post(request.url, request.body);

    return `mocked-message-id-${Math.random()}`;
  }

  const { messageId } = (await qstash.publishJSON<T>(
    request
  )) as PublishToUrlResponse;

  return messageId;
};

export const pushToQueue = async <T>(
  queueName: QUEUE_NAME,
  request: PublishRequest<T>
) => {
  if (env.NODE_ENV === 'development') {
    if (!request?.url) {
      throw new Error('request.url is required');
    }

    await axios.post(request.url, request.body);

    return `mocked-message-id-${Math.random()}`;
  }

  const queue = qstash.queue({ queueName });
  const { messageId } = (await queue.enqueueJSON<T>(
    request
  )) as PublishToUrlResponse;

  return messageId;
};

export enum QUEUE_NAME {
  STICKER_CAPTURE_GIF = 'sticker-capture-gif',
}

export const getMessageId = async (
  messageId: string
): Promise<{ state: State }> => {
  if (env.NODE_ENV === 'development') {
    return {
      state: 'DELIVERED' satisfies State,
    };
  }

  const event = await qstash
    .events({
      filter: {
        messageId,
      },
    })
    .then(({ events }) => events[0]);

  return {
    state: event.state,
  };
};
