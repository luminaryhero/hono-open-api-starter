import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import checkAuth from "@/common/middlewares/check-auth";
import { userSchema } from "@/drizzle/schemas/user";
import * as handler from "@/routers/user/user.handler";

/**
 * 更换绑定手机号
 */
const rebindPhoneRoute = createRoute({
  summary: "更换绑定手机号",
  tags: ["User"],
  method: "patch",
  path: "/user/rebind",
  security: [{ Bearer: [] }],
  request: {
    body: jsonContent(
      z.object({
        oldcaptcha: z.string().openapi({ description: "原手机验证码" }),
        captcha: z.string().openapi({ description: "新手机验证码" }),
        phone: z.string().openapi({ description: "新手机号" }),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(rebindPhoneRoute, handler.rebindPhoneHandler);

export type RebindPhoneRoute = typeof rebindPhoneRoute;

export default router;
