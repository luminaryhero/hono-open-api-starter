import type { Env } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppEnv extends Env {
  Variables: {
    logger: PinoLogger;
  };
}
