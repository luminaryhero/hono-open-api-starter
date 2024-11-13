import dayjs from "dayjs";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const taskTable = sqliteTable("task_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  done: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export const baseSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const taskGetSchema = z.object({
  name: z.string(),
  done: z.boolean(),
}).merge(baseSchema);

export const taskListSchema = z.object({
  meta: z.object({ total: z.number(), page: z.number(), pageSize: z.number() }),
  items: z.array(taskGetSchema),
});

export const taskCreateSchema = z.object({
  name: z.string(),
  done: z.boolean(),
});

export const taskUpdateSchema = z.object({
  name: z.string().optional(),
  done: z.boolean().optional(),
});

export type TaskTable = typeof taskTable;
