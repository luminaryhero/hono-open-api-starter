import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";
import type { TaskCreateRoute, TaskDeleteRoute, TaskListRoute, TaskUpdateRoute } from "@/routers/task.route";

import db from "@/db";
import { taskTable } from "@/db/schema";

export const taskListHandler: AppRouteHandler<TaskListRoute> = async (c) => {
  const tasks = await db.select().from(taskTable);
  return c.json(tasks);
};

export const taskCreateHandler: AppRouteHandler<TaskCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const updatedTask = await db.insert(taskTable).values(body);
  return c.json(updatedTask);
};

export const taskUpdateHandler: AppRouteHandler<TaskUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");
  const updatedTask = await db.update(taskTable).set(body).where(eq(taskTable.id, id));

  return c.json(updatedTask);
};

export const taskDeleteHandler: AppRouteHandler<TaskDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const deletedTask = await db.delete(taskTable).where(eq(taskTable.id, id));
  return c.json(deletedTask);
};
