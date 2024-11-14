import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const taskTable = sqliteTable("task_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  done: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export const taskSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(50),
  done: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export type TaskTable = typeof taskTable;
