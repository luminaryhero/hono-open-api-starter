import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import _ from "lodash";

import type { AppRouteHandler } from "@/common/types";
import type { TaskCreateRoute, TaskDeleteRoute, TaskGetRoute, TaskListRoute, TaskUpdateRoute } from "@/routers/task.route";

import { paginate, successResponse } from "@/common/helpers/database";
import db from "@/db";
import { taskTable } from "@/db/schema";

export const taskGetHandler: AppRouteHandler<TaskGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const task = await db.select().from(taskTable).where(eq(taskTable.id, id)).limit(1).get();
  if (_.isNil(task))
    throw new Error(`Task not found,id = ${id}`);

  return successResponse(c, task);
};

export const taskListHandler: AppRouteHandler<TaskListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const task = await db.select().from(taskTable);

  // 数据分页
  const data = paginate(task, page, pageSize);

  return successResponse(c, data);
};

export const taskCreateHandler: AppRouteHandler<TaskCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const createdTask = await db.insert(taskTable).values(body).returning().get();
  if (_.isNil(createdTask))
    throw new Error("Task create failed");

  return successResponse(c, createdTask);
};

export const taskUpdateHandler: AppRouteHandler<TaskUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");
  const updatedTask = await db.update(taskTable).set(body).where(eq(taskTable.id, id)).returning().get();
  if (_.isNil(updatedTask))
    throw new Error(`Task not found,id = ${id}`);

  return successResponse(c, updatedTask);
};

export const taskDeleteHandler: AppRouteHandler<TaskDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const deletedTask = await db.delete(taskTable).where(eq(taskTable.id, id)).returning().get();
  if (_.isNil(deletedTask))
    throw new Error(`Task not found,id = ${id}`);

  return successResponse(c, deletedTask);
};
