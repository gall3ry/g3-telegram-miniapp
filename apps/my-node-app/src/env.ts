import { z } from "zod";

export const env = z
  .object({
    BOT_TOKEN: z.string(),
    DATABASE_URL: z.string(),
  })
  .parse(process.env);
