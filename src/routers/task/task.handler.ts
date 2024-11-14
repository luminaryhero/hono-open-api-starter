import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type { TaskCreateRoute, TaskDeleteRoute, TaskGetRoute, TaskListRoute, TaskUpdateRoute } from "@/routers/task/task.router";

import { nilThrowError, paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { taskTable } from "@/drizzle/schemas/task";

/**
 * Get a task by id
 */
export const taskGetHandler: AppRouteHandler<TaskGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.taskTable.findFirst({
    where: eq(taskTable.id, id),
  });

  nilThrowError(data, `The task not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get task list
 */
export const taskListHandler: AppRouteHandler<TaskListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.taskTable.findMany({
    where: eq(taskTable.done, true),
    orderBy: (taskTable, { asc }) => asc(taskTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new task
 */
export const taskCreateHandler: AppRouteHandler<TaskCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(taskTable).values(body).returning();
  const data = result[0];

  nilThrowError(data, "The task create filed");

  return successResponse(c, data);
};

/**
 * Update a task
 */
export const taskUpdateHandler: AppRouteHandler<TaskUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(taskTable).set(body).where(eq(taskTable.id, id)).returning();

  const data = result[0];

  nilThrowError(data, `The task not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a task by id
 */
export const taskDeleteHandler: AppRouteHandler<TaskDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(taskTable).where(eq(taskTable.id, id)).returning();
  const data = result[0];

  nilThrowError(data, `The task not found,id = ${id}`);

  return successResponse(c, data);
};
