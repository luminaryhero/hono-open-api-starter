import type { Hook } from "@hono/zod-openapi";

import { z } from "zod";
import { fromError } from "zod-validation-error";

import { UNPROCESSABLE_ENTITY } from "../lib/http-status-codes";

/**
 * Default hook for OpenAPI validation errors.
 */
export const defaultHook: Hook<any, any, any, any> = async (result, c) => {
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

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

export function jsonContent<
  T extends ZodSchema,
>(schema: T, description: string = "") {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

export function jsonResponse<
  T extends ZodSchema,
>(schema: T, description: string = "") {
  return {
    content: {
      "application/json": {
        schema: z.object({
          code: z.number(),
          data: schema,
          message: z.string(),
        }),
      },
    },
    description,
  };
}

export function jsonPageResponse<
  T extends ZodSchema,
>(schema: T, description: string = "") {
  return {
    content: {
      "application/json": {
        schema: z.object({
          code: z.number(),
          data: z.object({
            meta: z.object({
              total: z.number(),
              page: z.number(),
              pageSize: z.number(),
            }),
            items: z.array(schema),
          }),
          message: z.string(),
        }),
      },
    },
    description,
  };
}
