import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "../lib/http-status-codes";

/**
 * Default hook for OpenAPI validation errors.
 *
 * Returns a JSON response with a -1 code, null data, and the validation error
 * message if the result is not successful.
 *
 * @param result - The result of the Zod validation
 * @param c - The Hono context
 */
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
