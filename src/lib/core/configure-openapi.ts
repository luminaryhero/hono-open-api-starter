import type { OpenAPIHono } from "@hono/zod-openapi";

import { apiReference } from "@scalar/hono-api-reference";

import type { AppEnv } from "../types";

export function configureOpenAPI(app: OpenAPIHono<AppEnv>) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My Hono API",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      spec: {
        url: "/doc",
      },
    }),
  );
}
