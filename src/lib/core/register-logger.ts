import type { OpenAPIHono } from "@hono/zod-openapi";

import { createLogger } from "../middlewares/pino-logger";

/**
 * Registers a logger middleware for the given OpenAPIHono app.
 *
 * This middleware logs incoming requests and responses, providing
 * detailed information such as request ID, method, and headers.
 *
 * @param app - The OpenAPIHono app to register the logger middleware with.
 */
export function registerLogger(app: OpenAPIHono) {
  app.use(createLogger());
}
