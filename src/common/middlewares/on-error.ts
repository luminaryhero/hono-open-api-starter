import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK } from "../lib/http-status-codes";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? (currentStatus as StatusCode)
    : INTERNAL_SERVER_ERROR;

  // eslint-disable-next-line node/no-process-env
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
  return c.json(
    {
      code: -1,
      data: null,
      message: err.message,
      stack: env === "production"
        ? undefined
        : err.stack,
    },
    statusCode,
  );
};

export default onError;
