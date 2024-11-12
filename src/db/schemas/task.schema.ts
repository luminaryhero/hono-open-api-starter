import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const taskTable = sqliteTable("task_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  done: integer({ mode: "boolean" }).notNull().default(false),
});
