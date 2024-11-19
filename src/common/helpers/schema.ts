import { z } from "zod";

export const idParamsSchema = z.object({
  id: z.string().transform(Number).pipe(z.coerce.number()),
});

export const IdUUidParamsSchema = z.object({
  id: z.string().uuid().openapi({
    param: {
      name: "id",
      in: "path",
    },
    required: ["id"],
    example: "4651e634-a530-4484-9b09-9616a28f35e3",
  }),
});

export const pageParamsSchema = z.object({
  page: z.string().transform(Number).pipe(z.coerce.number().min(1)).default("1").optional().openapi({
    param: {
      name: "page",
      in: "query",
      required: false,
      description: "页码",
    },
  }),
  pageSize: z.string().transform(Number).pipe(z.coerce.number().min(1)).optional().default("10").openapi({
    param: {
      name: "pageSize",
      in: "query",
      required: false,
      description: "每页条数",
    },
  }),
});

// Regular expression to validate slug format: alphanumeric, underscores, and dashes
const slugReg = /^[\w-]+$/;
const SLUG_ERROR_MESSAGE = "Slug can only contain letters, numbers, dashes, and underscores";

export const slugParamsSchema = z.object({
  slug: z.string()
    .regex(slugReg, SLUG_ERROR_MESSAGE)
    .openapi({
      param: {
        name: "slug",
        in: "path",
      },
      required: ["slug"],
      example: "my-cool-article",
    }),
});
