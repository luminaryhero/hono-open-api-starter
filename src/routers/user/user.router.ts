import { createRoute } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import IdParamsSchema from "@/common/schemas/id-params";
import PageParamsSchema from "@/common/schemas/page-params";
import { userSchema } from "@/drizzle/schemas/user";
import * as handler from "@/routers/user/user.handler";

const userGetRoute = createRoute({
  summary: "查找用户",
  tags: ["User"],
  method: "get",
  path: "/user/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

const userListRoute = createRoute({
  summary: "用户列表",
  tags: ["User"],
  method: "get",
  path: "/user",
  request: {
    query: PageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(userSchema),
  },
});

const userCreateRoute = createRoute({
  summary: "新增用户",
  tags: ["User"],
  method: "post",
  path: "/user",
  request: {
    body: jsonContent(
      userSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

const userUpdateRoute = createRoute({
  summary: "更新用户",
  tags: ["User"],
  method: "put",
  path: "/user/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContent(userSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(userSchema),
  },
});

const userDeleteRoute = createRoute({
  summary: "删除用户",
  tags: ["User"],
  method: "delete",
  path: "/user/{id}",
  request: {
    params: IdParamsSchema,
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
