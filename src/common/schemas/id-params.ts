import { z } from "@hono/zod-openapi";

const IdParamsSchema = z.object({
  id: z.string().transform(Number).pipe(z.coerce.number()),
});

export default IdParamsSchema;
