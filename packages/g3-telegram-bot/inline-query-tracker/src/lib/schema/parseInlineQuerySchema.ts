import { z } from "zod";
const schema = z.object({
  stickerId: z.coerce.number(),
});
export function parseInlineQuerySchema(query: unknown) {
  return schema.parse(query);
}
