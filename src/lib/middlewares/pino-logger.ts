import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import dayjs from "dayjs";
import _ from "lodash";

import env from "@/env";

const TODAY = dayjs().format('YYYY-MM-DD');

const prettyTransport = pino.transport(
  {
    target: 'pino-pretty',
    level: 'info',
    options: {
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      colorize: true
    },
  }
);


const fileTransport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      level: 'info',
      options: {
        destination: `./logs/${TODAY}-info`
      },
    },
    {
      target: 'pino/file',
      level: 'error',
      options: {
        destination: `./logs/${TODAY}-error`,
      },
    },
  ]
});

export function pinoLogger() {
  return logger({
    pino: pino(env.NODE_ENV === 'development' ? prettyTransport : fileTransport),
    http: {
      reqId: () => crypto.randomUUID(),
      onReqBindings: (c) => ({
        req: {
          url: c.req.path,
          method: c.req.method,
          headers: _.pickBy(
            c.req.header(),
            (value, key) => _.startsWith(key, "x-")
          ),
        }
      })
    },
  });
}