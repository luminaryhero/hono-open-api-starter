import { createRoute } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import IdParamsSchema from "@/common/schemas/id-params";
import PageParamsSchema from "@/common/schemas/page-params";
import { taskSchema } from "@/db/schemas/task";
import * as taskHandler from "@/routers/task/task.handler";

const taskGetRoute = createRoute({
  summary: "查找",
  tags: ["Task"],
  method: "get",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

const taskListRoute = createRoute({
  summary: "列表",
  tags: ["Task"],
  method: "get",
  path: "/task",
  request: {
    query: PageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(taskSchema),
  },
});

const taskCreateRoute = createRoute({
  summary: "新增",
  tags: ["Task"],
  method: "post",
  path: "/task",
  request: {
    body: jsonContent(
      taskSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

const taskUpdateRoute = createRoute({
  summary: "更新",
  tags: ["Task"],
  method: "put",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContent(taskSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

const taskDeleteRoute = createRoute({
  summary: "删除",
  tags: ["Task"],
  method: "delete",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(taskSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(taskGetRoute, taskHandler.taskGetHandler)
    .openapi(taskListRoute, taskHandler.taskListHandler)
    .openapi(taskCreateRoute, taskHandler.taskCreateHandler)
    .openapi(taskUpdateRoute, taskHandler.taskUpdateHandler)
    .openapi(taskDeleteRoute, taskHandler.taskDeleteHandler);

export type TaskGetRoute = typeof taskGetRoute;
export type TaskListRoute = typeof taskListRoute;
export type TaskCreateRoute = typeof taskCreateRoute;
export type TaskUpdateRoute = typeof taskUpdateRoute;
export type TaskDeleteRoute = typeof taskDeleteRoute;

export default router;
