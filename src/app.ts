import type { PinoLogger } from "hono-pino";

import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";

import { pinoLogger } from "@/lib/middlewares/pino-logger";

interface AppEnv {
  Variables: {
    logger: PinoLogger;
  };
}

const app = new OpenAPIHono<AppEnv>();

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

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

export default app;
