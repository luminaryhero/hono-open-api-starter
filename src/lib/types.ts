import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export interface AppEnv {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppEnv>;
