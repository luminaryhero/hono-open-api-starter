import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";

import { pinoLogger } from "@/lib/middlewares/pino-logger";

import type { AppEnv } from "../types";

/**
 * Creates a new Hono app with the default error and not found handlers
 * configured. This is a convenience function to make it easier to get
 * started with Hono.
 * @returns A new Hono app
 */
export function createApp() {
  const app = new OpenAPIHono<AppEnv>();
  app.onError(onError);
  app.notFound(notFound);
  app.use(pinoLogger());

  return app;
}
