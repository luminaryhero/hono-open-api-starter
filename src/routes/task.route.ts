import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { createOpenAPIRouter } from "@/lib/core/create-app";

const route = createRoute({
  tags: ["Task"],
  method: "get",
  path: "/task",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          name: z.string(),
          done: z.boolean(),
        }),
      ),
      "Task Api",
    ),
  },
});

const router = createOpenAPIRouter().openapi(route, (c) => {
  return c.json([
    {
      name: "Task 1",
      done: false,
    },
  ], HttpStatusCodes.OK);
});

export default router;
