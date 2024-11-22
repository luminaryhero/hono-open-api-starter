import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import checkAuth from "@/common/middlewares/check-auth";
import { captchaSchema } from "@/drizzle/schemas/captcha";
import * as handler from "@/routers/captcha/captcha.handler";

/**
 * 发送验证码
 */
const captchaSendRoute = createRoute({
  summary: "发送验证码",
  tags: ["Captcha"],
  method: "post",
  path: "/captcha/send",
  security: [{ Bearer: [] }],
  request: {
    body: jsonContent(
      z.object({
        phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(captchaSchema),
  },
});

/**
 * 验证验证码
 */
const captchaVerifyRoute = createRoute({
  summary: "验证验证码",
  tags: ["Captcha"],
  method: "post",
  path: "/captcha/verify",
  security: [{ Bearer: [] }],
  request: {
    body: jsonContent(
      z.object({
        phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
        captcha: z.string().length(6),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(captchaSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(captchaSendRoute, handler.captchaSendHandler)
    .openapi(captchaVerifyRoute, handler.captchaVerifyHandler);

export type CaptchaSendRoute = typeof captchaSendRoute;
export type CaptchaVerifyRoute = typeof captchaVerifyRoute;

export default router;
