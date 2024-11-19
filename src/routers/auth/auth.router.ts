import { createRoute, z } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";
import { cache } from "hono/cache";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonResponse } from "@/common/helpers/openapi";
import { asyncVerifyToken } from "@/common/helpers/util";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import { userSchema } from "@/drizzle/schemas/user";
import * as handler from "@/routers/auth/auth.handler";

/**
 * 登录
 */
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

/**
 * 注册
 */
const registerRoute = createRoute({
  summary: "注册",
  tags: ["Auth"],
  method: "post",
  path: "/auth/register",
  request: {
    body: jsonContent(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
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
  path: "/auth/userInfo",
  request: {},
  middleware: [
    bearerAuth({
      verifyToken: asyncVerifyToken,
    }),
    cache({ cacheName: "userInfo" }),
  ] as const, // Use `as const` to ensure TypeScript infers the middleware's Context.
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(
      userSchema,
    ),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(loginRoute, handler.loginHandler)
    .openapi(registerRoute, handler.registerHandler)
    .openapi(userInfoRoute, handler.userInfoHandler);

export type LoginRoute = typeof loginRoute;
export type RegisterRoute = typeof registerRoute;
export type UserInfoRoute = typeof userInfoRoute;

export default router;
