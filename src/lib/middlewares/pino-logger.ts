import dayjs from "dayjs";
import { pinoLogger as logger } from "hono-pino";
import _ from "lodash";
import pino, { type Level } from "pino";

import env from "@/env";

const TODAY = dayjs().format("YYYY-MM-DD");
const TIME_STAMP = dayjs().format("YYYY-MM-DD HH:mm:ss");

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

export function pinoLogger() {
  return logger({
    pino: pino({
      level: env.LOG_LEVEL,
      formatters: {
        level: label => ({ level: label }),
      },
      timestamp: () => TIME_STAMP,
    }, env.NODE_ENV === "development"
      ? createPrettyTransport(env.LOG_LEVEL)
      : createFileTransport(env.LOG_LEVEL)),
    http: {
      reqId: () => crypto.randomUUID(),
      onReqBindings: c => ({
        req: {
          url: c.req.path,
          method: c.req.method,
          headers: _.pickBy(
            c.req.header(),
            (value, key) => _.startsWith(key, "x-"),
          ),
        },
      }),
    },
  });
}
