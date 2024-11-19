import { OpenAPIHono } from "@hono/zod-openapi";

import { defaultHook } from "../helpers/openapi";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";

/**
 * Creates a new OpenAPIHono router with the default hook configured.
 *
 * The default hook will validate the request and response bodies using the
 * OpenAPI schema defined in the route.
 *
 * The router is configured to be "strict" for validation, meaning that it
 * will return an error if a response has extra properties not defined in the
 * OpenAPI schema.
 */
export function createOpenAPIRouter() {
  return new OpenAPIHono({
    strict: true,
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

  return app;
}
