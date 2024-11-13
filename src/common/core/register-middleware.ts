import type { OpenAPIHono } from "@hono/zod-openapi";

import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

export function registerMiddlewares(app: OpenAPIHono) {
  app.use(cors(), prettyJSON());
}
