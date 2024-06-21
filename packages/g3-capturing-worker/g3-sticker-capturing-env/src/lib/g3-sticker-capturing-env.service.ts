import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string().url().default('https://staging.miniapp.gall3ry.io'),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

@Injectable()
export class G3StickerCapturingEnvService {
  constructor(private configService: ConfigService<Env, true>) {}
  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
