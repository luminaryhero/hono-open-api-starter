import type { OpenAPIHono } from "@hono/zod-openapi";

/**
 * Registers an array of OpenAPIHono routers with the given app.
 * @param app - The app to register the routers with.
 * @param routers - The routers to register with the app.
 */
export function registerRouter(app: OpenAPIHono, routers: OpenAPIHono[]) {
  routers.forEach(router => app.route("/api", router));
}
