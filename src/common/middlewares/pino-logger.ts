import { pinoLogger } from "hono-pino";
import pino, { type Level } from "pino";
import pretty from "pino-pretty";

import env from "@/env";

import { dateFormat, now } from "../helpers/date";

const LOG_LEVEL = env.LOG_LEVEL || "info";
const NODE_ENV = env.NODE_ENV || "development";

function createFileTransport(level: Level) {
  return pino.transport(
    {
      level,
      target: "pino/file",
      options: {
        destination: `./logs/${dateFormat(now(), "YYYY-MM-DD")}-${level}`,
      },
    },
  );
}

export const pinoLoggerMiddleware = pinoLogger({
  pino: pino({
    level: LOG_LEVEL,
    formatters: {
      level: label => ({ level: label }),
    },
  }, NODE_ENV === "production"
    ? createFileTransport(LOG_LEVEL)
    : pretty()),
  http: {
    reqId: () => crypto.randomUUID(),
  },
});
