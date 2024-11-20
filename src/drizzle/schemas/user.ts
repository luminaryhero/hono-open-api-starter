import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const userTable = pgTable("user_table", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(20),
  password: z.string().min(6).max(20),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type UserTable = z.infer<typeof userSchema>;
