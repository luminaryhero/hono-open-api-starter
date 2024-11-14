import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const taskTable = sqliteTable("task_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  done: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export const taskSchema = z.object({
  id: z.number(),
  name: z.string(),
  done: z.boolean(),
  createdAt: z.date().or(z.null()),
  updatedAt: z.date().or(z.null()),
});

export type TaskTable = typeof taskTable;
