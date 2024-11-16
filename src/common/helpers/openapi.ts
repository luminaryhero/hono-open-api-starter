import type { Hook } from "@hono/zod-openapi";

import { fromError } from "zod-validation-error";

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
    const validationError = fromError(result.error);
    const message = validationError.toString();
    c.var.logger.error(message);

    return c.json(
      {
        code: -1,
        data: null,
        message: message || "validation error",
      },
      UNPROCESSABLE_ENTITY,
    );
  }
};

export default defaultHook;
