import { createRoute } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import checkAuth from "@/common/middlewares/check-auth";
import { userSchema } from "@/drizzle/schemas/user";
import * as handler from "@/routers/user/user.handler";

/**
 * 查找用户
 */
const userGetRoute = createRoute({
  summary: "查找用户",
  tags: ["User"],
  method: "get",
  path: "/user/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

/**
 * 用户列表
 */
const userListRoute = createRoute({
  summary: "用户列表",
  tags: ["User"],
  method: "get",
  path: "/user",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    query: pageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(userSchema),
  },
});

/**
 * 新增用户
 */
const userCreateRoute = createRoute({
  summary: "新增用户",
  tags: ["User"],
  method: "post",
  path: "/user",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    body: jsonContent(
      userSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

/**
 * 更新用户
 */
const userUpdateRoute = createRoute({
  summary: "更新用户",
  tags: ["User"],
  method: "put",
  path: "/user/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
    body: jsonContent(userSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

/**
 * 删除用户
 */
const userDeleteRoute = createRoute({
  summary: "删除用户",
  tags: ["User"],
  method: "delete",
  path: "/user/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(userGetRoute, handler.userGetHandler)
    .openapi(userListRoute, handler.userListHandler)
    .openapi(userCreateRoute, handler.userCreateHandler)
    .openapi(userUpdateRoute, handler.userUpdateHandler)
    .openapi(userDeleteRoute, handler.userDeleteHandler);

export type UserGetRoute = typeof userGetRoute;
export type UserListRoute = typeof userListRoute;
export type UserCreateRoute = typeof userCreateRoute;
export type UserUpdateRoute = typeof userUpdateRoute;
export type UserDeleteRoute = typeof userDeleteRoute;

export default router;
