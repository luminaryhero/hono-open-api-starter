import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import _ from "lodash";

import type { AppRouteHandler } from "@/lib/types";
import type { TaskCreateRoute, TaskDeleteRoute, TaskGetRoute, TaskListRoute, TaskUpdateRoute } from "@/routers/task.route";

import db from "@/db";
import { taskTable } from "@/db/schema";
import { paginate } from "@/lib/helpers/database";

export const taskGetHandler: AppRouteHandler<TaskGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const task = await db.select().from(taskTable).where(eq(taskTable.id, id)).limit(1).get();
  if (_.isNil(task))
    throw new Error(`Task not found,id = ${id}`);

  return c.json(task);
};

export const taskListHandler: AppRouteHandler<TaskListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("param");

  const rows = await db.select().from(taskTable);

  // 响应数据转换
  const data = rows.map(task => ({
    ...task,
    createdAt: _.isNil(task.createdAt) ? "" : dayjs(task.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: _.isNil(task.updatedAt) ? "" : dayjs(task.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
  }));

  // 数据分页
  const result = paginate(data, page, pageSize);

  return c.json(result);
};

export const taskCreateHandler: AppRouteHandler<TaskCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const createdTask = await db.insert(taskTable).values(body).returning().get();
  if (_.isNil(createdTask))
    throw new Error("Task create failed");

  return c.json(createdTask);
};

export const taskUpdateHandler: AppRouteHandler<TaskUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");
  const updatedTask = await db.update(taskTable).set(body).where(eq(taskTable.id, id)).returning().get();
  if (_.isNil(updatedTask))
    throw new Error(`Task not found,id = ${id}`);

  return c.json(updatedTask);
};

export const taskDeleteHandler: AppRouteHandler<TaskDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const deletedTask = await db.delete(taskTable).where(eq(taskTable.id, id)).returning().get();
  if (_.isNil(deletedTask))
    throw new Error(`Task not found,id = ${id}`);

  return c.json(deletedTask);
};
