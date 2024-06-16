import { z } from 'zod';

export const env = z
  .object({
    NEXT_PUBLIC_G3_ENV: z
      .enum(['development', 'staging', 'production'])
      .default('development'),
    BOT_TOKEN: z.string(),
    DATABASE_URL: z.string(),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .url()
      .default('https://evolved-scorpion-40186.upstash.io'),
    UPSTASH_REDIS_REST_TOKEN: z
      .string()
      .default(
        'AZz6ASQgMzQ5NmRmNGYtNTBiMC00MWE0LTkyNDktOGMxODFmNWQyMmI4MGY5MjVjZmY3N2RhNDg4NzgzNmM0MDNkYjA3Nzg3ODU='
      ),
  })
  .parse(process.env);
