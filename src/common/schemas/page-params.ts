import { z } from "zod";

const pageParamSchema = z.object({
  page: z.string().transform(Number).pipe(z.coerce.number()).default("1").optional().openapi({
    param: {
      name: "page",
      in: "query",
      required: false,
      description: "页码",
    },
  }),
  pageSize: z.string().transform(Number).pipe(z.coerce.number()).optional().default("10").openapi({
    param: {
      name: "pageSize",
      in: "query",
      required: false,
      description: "每页条数",
    },
  }),
});

export default pageParamSchema;
