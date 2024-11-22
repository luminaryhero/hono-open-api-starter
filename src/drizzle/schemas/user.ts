import type { z } from "zod";

import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userTable = pgTable("user_table", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const userSchema = createSelectSchema(userTable);
export const userInsertSchema = createInsertSchema(userTable).omit({ id: true });
export const userUpdateSchema = userInsertSchema.partial();

export type UserTable = z.infer<typeof userSchema>;
