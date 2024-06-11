import { z } from "zod";
const schema = z.object({
  stickerId: z.coerce.number(),
  telegramUserId: z.coerce.number(), // for caching purpose
});
export function parseInlineQuerySchema(query: unknown) {
  return schema.parse(query);
}
