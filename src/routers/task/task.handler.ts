import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/task/task.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { taskTable } from "@/drizzle/schemas/task";

/**
 * Get a task by id
 */
export const taskGetHandler: AppRouteHandler<RT.TaskGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.taskTable.findFirst({
    where: eq(taskTable.id, id),
  });

  if (!data)
    throw new Error(`The task not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get task list
 */
export const taskListHandler: AppRouteHandler<RT.TaskListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.taskTable.findMany({
    orderBy: (taskTable, { asc }) => asc(taskTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new task
 */
export const taskCreateHandler: AppRouteHandler<RT.TaskCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(taskTable).values(body).returning();
  const data = result[0];

  if (!data)
    throw new Error("The task create filed");

  return successResponse(c, data);
};

/**
 * Update a task
 */
export const taskUpdateHandler: AppRouteHandler<RT.TaskUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(taskTable).set(body).where(eq(taskTable.id, id)).returning();

  const data = result[0];

  if (!data)
    throw new Error(`The task not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a task by id
 */
export const taskDeleteHandler: AppRouteHandler<RT.TaskDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(taskTable).where(eq(taskTable.id, id)).returning();
  const data = result[0];

  if (!data)
    throw new Error(`The task not found,id = ${id}`);

  return successResponse(c, data);
};
