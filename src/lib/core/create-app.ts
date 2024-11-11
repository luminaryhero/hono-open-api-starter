import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { pinoLogger } from "@/lib/middlewares/pino-logger";

import type { AppEnv } from "../types";

export function createOpenAPIRouter() {
  return new OpenAPIHono<AppEnv>({
    strict: false,
    defaultHook,
  });
}

/**
 * Creates a new Hono app with the default error and not found handlers
 * configured. This is a convenience function to make it easier to get
 * started with Hono.
 * @returns A new Hono app
 */
export function createApp() {
  const app = createOpenAPIRouter();
  app.onError(onError);
  app.notFound(notFound);
  app.use(pinoLogger());

  return app;
}
