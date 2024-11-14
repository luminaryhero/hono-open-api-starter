import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { now } from "@/common/helpers/date";

export const taskTable = pgTable("task_table", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  done: boolean().notNull().default(false),
  createdAt: timestamp("created_at").$defaultFn(now),
  updatedAt: timestamp("updated_at").$defaultFn(now).$onUpdate(now),
});

export const taskSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
  done: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export type TaskTable = typeof taskTable;
