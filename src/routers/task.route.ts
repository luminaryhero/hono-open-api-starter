import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/schema";
import IdParamsSchema from "@/common/schemas/id-params";
import PageParamsSchema from "@/common/schemas/page-params";
import { TaskSchema } from "@/db/schema";
import { taskCreateHandler, taskDeleteHandler, taskGetHandler, taskListHandler, taskUpdateHandler } from "@/handlers/task.handler";

const taskGetRoute = createRoute({

  tags: ["Task"],
  method: "get",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(TaskSchema),
  },
});

const taskListRoute = createRoute({
  tags: ["Task"],
  method: "get",
  path: "/task",
  request: {
    // params: PageParamsSchema,
    query: PageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(TaskSchema),
  },
});

const taskCreateRoute = createRoute({
  tags: ["Task"],
  method: "post",
  path: "/task",
  request: {
    body: jsonContent(
      TaskSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(TaskSchema),
  },
});

const taskUpdateRoute = createRoute({
  tags: ["Task"],
  method: "put",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContent(
      TaskSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(TaskSchema),
  },
});

const taskDeleteRoute = createRoute({
  tags: ["Task"],
  method: "delete",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(TaskSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(taskGetRoute, taskGetHandler)
    .openapi(taskListRoute, taskListHandler)
    .openapi(taskCreateRoute, taskCreateHandler)
    .openapi(taskUpdateRoute, taskUpdateHandler)
    .openapi(taskDeleteRoute, taskDeleteHandler);

export type TaskGetRoute = typeof taskGetRoute;
export type TaskListRoute = typeof taskListRoute;
export type TaskCreateRoute = typeof taskCreateRoute;
export type TaskUpdateRoute = typeof taskUpdateRoute;
export type TaskDeleteRoute = typeof taskDeleteRoute;

export default router;
