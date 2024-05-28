import dotenv from 'dotenv';
import { z } from 'zod';
// load env
dotenv.config();

export const env = z
  .object({
    TELEGRAM_API_ID: z.coerce.number(),
    TELEGRAM_API_HASH: z.string(),
    TELEGRAM_STRING_SESSION: z.string(),
    DATABASE_URL: z.string(),
  })
  .parse(process.env);
