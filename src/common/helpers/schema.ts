import { z } from "zod";

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
          data: schema,
          message: z.string(),
        }),
      },
    },
    description,
  };
}