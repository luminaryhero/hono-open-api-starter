import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import checkAuth from "@/common/middlewares/check-auth";
import { permissionSchema } from "@/drizzle/schemas/permission";
import * as handler from "@/routers/permission/permission.handler";

/**
 * 查找权限
 */
const permissionGetRoute = createRoute({
  summary: "查找权限",
  tags: ["Permission"],
  method: "get",
  path: "/permission/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(permissionSchema),
  },
});

/**
 * 权限列表
 */
const permissionListRoute = createRoute({
  summary: "权限列表",
  tags: ["Permission"],
  method: "get",
  path: "/permission",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    query: pageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(permissionSchema),
  },
});

/**
 * 新增权限
 */
const permissionCreateRoute = createRoute({
  summary: "新增权限",
  tags: ["Permission"],
  method: "post",
  path: "/permission",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    body: jsonContent(
      permissionSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(permissionSchema),
  },
});

/**
 * 更新权限
 */
const permissionUpdateRoute = createRoute({
  summary: "更新权限",
  tags: ["Permission"],
  method: "put",
  path: "/permission/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
    body: jsonContent(
      permissionSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial(),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(permissionSchema),
  },
});

/**
 * 删除权限
 */
const permissionDeleteRoute = createRoute({
  summary: "删除权限",
  tags: ["Permission"],
  method: "delete",
  path: "/permission/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ roles: ["admin"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(permissionSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(permissionGetRoute, handler.permissionGetHandler)
    .openapi(permissionListRoute, handler.permissionListHandler)
    .openapi(permissionCreateRoute, handler.permissionCreateHandler)
    .openapi(permissionUpdateRoute, handler.permissionUpdateHandler)
    .openapi(permissionDeleteRoute, handler.permissionDeleteHandler);

export type PermissionGetRoute = typeof permissionGetRoute;
export type PermissionListRoute = typeof permissionListRoute;
export type PermissionCreateRoute = typeof permissionCreateRoute;
export type PermissionUpdateRoute = typeof permissionUpdateRoute;
export type PermissionDeleteRoute = typeof permissionDeleteRoute;

export default router;
