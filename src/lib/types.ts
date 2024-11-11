import type { PinoLogger } from "hono-pino";

export interface AppEnv<T> {
  Bindings: T;
  Variables: {
    logger: PinoLogger;
  };
}

export interface BaseEnv {
  NODE_ENV: "development" | "production" | "test";
}
