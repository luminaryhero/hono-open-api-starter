import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";

import type { AppEnv } from "@/lib/types";

import { configureOpenAPI } from "@/lib/core/configure-openapi";
import { pinoLogger } from "@/lib/middlewares/pino-logger";

const app = new OpenAPIHono<AppEnv>();
configureOpenAPI(app);

app.onError(onError);
app.notFound(notFound);

app.use(pinoLogger());

const route = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "index Api",
    },
  },
});

app.openapi(route, (c) => {
  return c.json({
    message: "Hello Hono!",
  });
});

app.get("/error", (c) => {
  c.var.logger.error("error log");
  throw new Error("Oh No!");
});

export default app;
