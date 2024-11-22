import { createRoute, z } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonResponse } from "@/common/helpers/openapi";
import { verifyToken } from "@/common/helpers/util";
import { userSchema } from "@/drizzle/schemas/user";
import * as handler from "@/routers/auth/auth.handler";

/**
 * 邮箱登录
 */
const emailLoginRoute = createRoute({
  summary: "邮箱登录",
  tags: ["Auth"],
  method: "post",
  path: "/auth/login/email",
  request: {
    body: jsonContent(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
    ),
  },
});

/**
 * 手机登录
 */
const phoneLoginRoute = createRoute({
  summary: "手机登录",
  tags: ["Auth"],
  method: "post",
  path: "/auth/login/phone",
  request: {
    body: jsonContent(
      z.object({
        phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
        password: z.string(),
        captcha: z.string().length(6).optional(),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
    ),
  },
});

/**
 * 手机注册
 */
const registerRoute = createRoute({
  summary: "手机注册",
  tags: ["Auth"],
  method: "post",
  path: "/auth/register",
  request: {
    body: jsonContent(
      z.object({
        username: z.string(),
        password: z.string(),
        phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
        captcha: z.string().length(6),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      userSchema,
    ),
  },
});

/**
 * 当前用户信息
 */
const userInfoRoute = createRoute({
  summary: "当前用户信息",
  tags: ["Auth"],
  method: "get",
  path: "/auth/userinfo",
  request: {},
  middleware: [
    bearerAuth({
      verifyToken,
    }),
  ] as const, // Use `as const` to ensure TypeScript infers the middleware's Context.
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      userSchema,
    ),
  },
});

/**
 * 刷新Token
 */
const refreshTokenRoute = createRoute({
  summary: "刷新Token",
  tags: ["Auth"],
  method: "post",
  path: "/auth/refreshToken",
  request: {
    body: jsonContent(
      z.object({
        refreshToken: z.string(),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      z.object({
        accessToken: z.string(),
      }),
    ),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(emailLoginRoute, handler.emailLoginHandler)
    .openapi(phoneLoginRoute, handler.phoneLoginHandler)
    .openapi(registerRoute, handler.registerHandler)
    .openapi(userInfoRoute, handler.userInfoHandler)
    .openapi(refreshTokenRoute, handler.refreshTokenHandler);

export type RegisterRoute = typeof registerRoute;
export type UserInfoRoute = typeof userInfoRoute;
export type RefreshTokenRoute = typeof refreshTokenRoute;
export type EmailLoginRoute = typeof emailLoginRoute;
export type PhoneLoginRoute = typeof phoneLoginRoute;

export default router;
