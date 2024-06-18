import { env } from '@gall3ry/g3-miniapp-env';
import {
  Client,
  type PublishRequest,
  type PublishToUrlResponse,
} from '@upstash/qstash';
import { Redis } from '@upstash/redis';
import axios from 'axios';
export enum Key {
  LEADERBOARD = 'leaderboard',
}

const mapCacheKeyToTimeExpiry: Record<Key, number> = {
  [Key.LEADERBOARD]: 60,
};

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const qstash = new Client({
  token: env.UPSTASH_QSTASH_TOKEN,
});

export const callOrGetFromCache = async <T>(
  key: Key,
  callback: () => Promise<T>
): Promise<T> => {
  if (env.NEXT_PUBLIC_G3_ENV === 'development') {
    return callback();
  }

  const cacheKey = key;
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

    await axios.post(request.url, request.body);

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
