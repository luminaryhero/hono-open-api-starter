import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "../lib/http-status-codes";

const defaultHook: Hook<any, any, any, any> = async (result, c) => {
  if (!result.success) {
    return c.json(
      {
        code: -1,
        data: null,
        message: result.error?.issues[0]?.message || "validation error",
      },
      UNPROCESSABLE_ENTITY,
    );
  }
};

export default defaultHook;
