import { createRoute, z } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonResponse } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import * as handler from "@/routers/auth/auth.handler";

const loginRoute = createRoute({
  summary: "登录",
  tags: ["Auth"],
  method: "post",
  path: "/auth/login",
  request: {
    body: jsonContent(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      z.object({
        token: z.string(),
      }),
    ),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(loginRoute, handler.loginHandler);

export type LoginRoute = typeof loginRoute;

export default router;
