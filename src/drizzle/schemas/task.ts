import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const taskTable = pgTable("task_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const taskSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
  done: z.boolean(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type TaskTable = typeof taskTable;
