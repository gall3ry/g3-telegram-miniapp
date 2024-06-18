import { z } from "zod";

export const updateInputNameSchema = z.object({
  displayName: z.string().min(5).max(50).trim().optional(),
  telegramId: z.number().optional(),
});
