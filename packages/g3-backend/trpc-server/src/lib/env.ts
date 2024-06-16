import { z } from 'zod';

export const env = z
  .object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    JWT_SECRET: z.string(),
    BOT_TOKEN: z.string(),
    TON_API_KEY: z
      .string()
      .default(
        'AF6GGCODMULLAEYAAAAEE6TZ6PWQRJIDMH4MAPBEOJGLQMAFGQS7C7UZRG7NZT64PL4SRMQ'
      ),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .url()
      .default('https://evolved-scorpion-40186.upstash.io'),
    UPSTASH_REDIS_REST_TOKEN: z
      .string()
      .default(
        'AZz6ASQgMzQ5NmRmNGYtNTBiMC00MWE0LTkyNDktOGMxODFmNWQyMmI4MGY5MjVjZmY3N2RhNDg4NzgzNmM0MDNkYjA3Nzg3ODU='
      ),
    UPSTASH_QSTASH_TOKEN: z
      .string()
      .default(
        'eyJVc2VySUQiOiJlODdmNTIwNS1mOTQxLTRlZDgtYjRhNS0wMTljNmMwZjZmZDEiLCJQYXNzd29yZCI6IjZlZDE2YWZmYzJjNDQxMDBiMTc3MzNlZThjNzM2NTA1In0='
      ),
    WORKER_PUBLIC_URL: z
      .string()
      .url()
      .default('https://g3-stg-telegram-worker.fly.dev'),

    AKORD_EMAIL: z.string().default('tin@platfarm.net'),
    AKORD_PASSWORD: z.string().default('PlatFarm123!@#'),

    // Client
    NEXT_PUBLIC_G3_ENV: z
      .enum(['development', 'staging', 'production'])
      .default('development'),
    NEXT_PUBLIC_TWA_RETURN_URL: z
      .string()
      .url()
      .regex(/t.me\/.+/)
      .default('https://t.me/g3stg1bot/test'),
    NEXT_PUBLIC_TWA_MANIFEST_URL: z
      .string()
      .url()
      .default('https://staging.miniapp.gall3ry.io/tonconnect-manifest.json'),
    NEXT_PUBLIC_POSTHOG_KEY: z
      .string()
      .default('phc_iWwszv1jODV18AKPZcqRmXql2B5B4eOqJ3gmnRWMZmC'),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().default('https://us.i.posthog.com'),
    NEXT_PUBLIC_COMMUNITY_CHAT_ID: z
      .string()
      .regex(/@.+/)
      .default('@testabc1234578'),
    NEXT_PUBLIC_TON_API_KEY_FRONTEND: z
      .string()
      .default(
        'AF6GGCODOGMETNQAAAAM75NIXLA466TL7EESFD7Q7JBZH6DPK3AZYQOUAABLCI4ONMZFL2Y'
      ),
  })
  .parse(process.env);
