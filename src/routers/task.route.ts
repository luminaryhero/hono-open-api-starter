import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { IdParamsSchema } from "stoker/openapi/schemas";
import { z } from "zod";

import { taskCreateHandler, taskDeleteHandler, taskListHandler, taskUpdateHandler } from "@/handlers/task.handler";
import { createOpenAPIRouter } from "@/lib/core/create-app";

const taskListRoute = createRoute({
  tags: ["Task"],
  method: "get",
  path: "/task",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          name: z.string(),
          done: z.boolean(),
        }),
      ),
      "Task list Api",
    ),
  },
});

const taskCreateRoute = createRoute({
  tags: ["Task"],
  method: "post",
  path: "/task",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        name: z.string(),
        done: z.boolean(),
      }),
      "Task Create Api",
    ),
  },
});

const taskUpdateRoute = createRoute({
  tags: ["Task"],
  method: "put",
  path: "/task/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        name: z.string(),
        done: z.boolean(),
      }),
      "Task Update Api",
    ),
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
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Task Delete Api",
    ),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(taskListRoute, taskListHandler)
    .openapi(taskCreateRoute, taskCreateHandler)
    .openapi(taskUpdateRoute, taskUpdateHandler)
    .openapi(taskDeleteRoute, taskDeleteHandler);

export type TaskListRoute = typeof taskListRoute;
export type TaskCreateRoute = typeof taskCreateRoute;
export type TaskUpdateRoute = typeof taskUpdateRoute;
export type TaskDeleteRoute = typeof taskDeleteRoute;

export default router;
