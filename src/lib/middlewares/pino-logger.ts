import dayjs from "dayjs";
import { pinoLogger } from "hono-pino";
import _ from "lodash";
import pino, { type Level } from "pino";
import pretty from "pino-pretty";

import env from "@/env";

const TODAY = dayjs().format("YYYY-MM-DD");
// const TIME_STAMP = dayjs().format("YYYY-MM-DD HH:mm:ss");
const LOG_LEVEL = env.LOG_LEVEL || "info";
const NODE_ENV = env.NODE_ENV || "development";

function createPrettyTransport(level: Level) {
  return pino.transport({
    level,
    target: "pino-pretty",
    options: {
      translateTime: "yyyy-mm-dd HH:MM:ss",
    },
  });
}

function createFileTransport(level: Level) {
  return pino.transport(
    {
      level,
      target: "pino/file",
      options: {
        destination: `./logs/${TODAY}-${level}`,
      },
    },
  );
}

export function createLogger() {
  return pinoLogger({
    pino: pino({
      level: LOG_LEVEL,
      formatters: {
        level: label => ({ level: label }),
      },
      // timestamp: () => TIME_STAMP,
    }, NODE_ENV === "production"
      ? createFileTransport(LOG_LEVEL)
      : createPrettyTransport(LOG_LEVEL)),
    http: {
      reqId: () => crypto.randomUUID(),
      onReqBindings: c => ({
        req: {
          url: c.req.path,
          method: c.req.method,
          headers: _.pickBy(
            c.req.header(),
            (_value, key) => _.startsWith(key, "x-"),
          ),
        },
      }),
    },
  });
}
