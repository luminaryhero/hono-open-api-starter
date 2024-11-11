import { createRoute, z } from "@hono/zod-openapi";

import { configureOpenAPI } from "@/lib/core/configure-openapi";

import { createApp } from "./lib/core/create-app";

const app = createApp();
configureOpenAPI(app);

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
