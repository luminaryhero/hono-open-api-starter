import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { createOpenAPIRouter } from "@/common/core/create-app";

const route = createRoute({
  tags: ["Index"],
  method: "get",
  path: "/",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Hello Hono",
    ),
  },
});

const router = createOpenAPIRouter().openapi(route, (c) => {
  return c.json({
    message: "Hello Hono!",
  }, HttpStatusCodes.OK);
});

export default router;
