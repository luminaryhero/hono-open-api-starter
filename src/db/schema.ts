import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const taskTable = sqliteTable("task_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  done: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const taskListSchema = z.array(
  z.object({
    name: z.string(),
    done: z.boolean(),
    // createdAt: z.date().optional(),
    // updatedAt: z.date().optional(),
  }),
);

export const taskCreateSchema = z.object({
  name: z.string(),
  done: z.boolean(),
});

export const taskUpdateSchema = z.object({
  name: z.string().optional(),
  done: z.boolean().optional(),
});
