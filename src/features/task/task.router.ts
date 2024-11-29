import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import checkAuth from "@/common/middlewares/check-auth";
import { taskSchema } from "@/drizzle/schemas/task";
import * as handler from "@/routers/task/task.handler";

/**
 * 查找任务
 */
const taskGetRoute = createRoute({
  summary: "查找任务",
  tags: ["Task"],
  method: "get",
  path: "/task/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ permissions: ["task:view"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

/**
 * 任务列表
 */
const taskListRoute = createRoute({
  summary: "任务列表",
  tags: ["Task"],
  method: "get",
  path: "/task",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ permissions: ["task:view"] }),
  ] as const,
  request: {
    query: pageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(taskSchema),
  },
});

/**
 * 新增任务
 */
const taskCreateRoute = createRoute({
  summary: "新增任务",
  tags: ["Task"],
  method: "post",
  path: "/task",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ permissions: ["task:edit"] }),
  ] as const,
  request: {
    body: jsonContent(
      taskSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

/**
 * 更新任务
 */
const taskUpdateRoute = createRoute({
  summary: "更新任务",
  tags: ["Task"],
  method: "put",
  path: "/task/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ permissions: ["task:edit"] }),
  ] as const,
  request: {
    params: idParamsSchema,
    body: jsonContent(
      taskSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial(),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

/**
 * 删除任务
 */
const taskDeleteRoute = createRoute({
  summary: "删除任务",
  tags: ["Task"],
  method: "delete",
  path: "/task/{id}",
  security: [{ Bearer: [] }],
  middleware: [
    checkAuth({ permissions: ["task:delete"] }),
  ] as const,
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(taskGetRoute, handler.taskGetHandler)
    .openapi(taskListRoute, handler.taskListHandler)
    .openapi(taskCreateRoute, handler.taskCreateHandler)
    .openapi(taskUpdateRoute, handler.taskUpdateHandler)
    .openapi(taskDeleteRoute, handler.taskDeleteHandler);

export type TaskGetRoute = typeof taskGetRoute;
export type TaskListRoute = typeof taskListRoute;
export type TaskCreateRoute = typeof taskCreateRoute;
export type TaskUpdateRoute = typeof taskUpdateRoute;
export type TaskDeleteRoute = typeof taskDeleteRoute;

export default router;
