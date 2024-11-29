import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import checkAuth from "@/common/middlewares/check-auth";
import { roleSchema } from "@/drizzle/schemas/role";
import * as handler from "@/routers/role/role.handler";

/**
 * 查找角色
 */
const roleGetRoute = createRoute({
  summary: "查找角色",
  tags: ["Role"],
  method: "get",
  path: "/role/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(roleSchema),
  },
});

/**
 * 角色列表
 */
const roleListRoute = createRoute({
  summary: "角色列表",
  tags: ["Role"],
  method: "get",
  path: "/role",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    query: pageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(roleSchema),
  },
});

/**
 * 新增角色
 */
const roleCreateRoute = createRoute({
  summary: "新增角色",
  tags: ["Role"],
  method: "post",
  path: "/role",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    body: jsonContent(
      roleSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(roleSchema),
  },
});

/**
 * 更新角色
 */
const roleUpdateRoute = createRoute({
  summary: "更新角色",
  tags: ["Role"],
  method: "put",
  path: "/role/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
    body: jsonContent(
      roleSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial(),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(roleSchema),
  },
});

/**
 * 删除角色
 */
const roleDeleteRoute = createRoute({
  summary: "删除角色",
  tags: ["Role"],
  method: "delete",
  path: "/role/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["super"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(roleSchema),
  },
});

/**
 * 分配角色权限
 */
const roleAssignPermissionRoute = createRoute({
  summary: "分配角色权限",
  tags: ["Role"],
  method: "post",
  path: "/role-permission",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    body: jsonContent(
      z.object({
        roleId: z.number(),
        permissionIds: z.array(z.number()),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(roleSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(roleGetRoute, handler.roleGetHandler)
    .openapi(roleListRoute, handler.roleListHandler)
    .openapi(roleCreateRoute, handler.roleCreateHandler)
    .openapi(roleUpdateRoute, handler.roleUpdateHandler)
    .openapi(roleDeleteRoute, handler.roleDeleteHandler)
    .openapi(roleAssignPermissionRoute, handler.roleAssignPermissionHandler);

export type RoleGetRoute = typeof roleGetRoute;
export type RoleListRoute = typeof roleListRoute;
export type RoleCreateRoute = typeof roleCreateRoute;
export type RoleUpdateRoute = typeof roleUpdateRoute;
export type RoleDeleteRoute = typeof roleDeleteRoute;
export type RoleAssignPermissionRoute = typeof roleAssignPermissionRoute;

export default router;
