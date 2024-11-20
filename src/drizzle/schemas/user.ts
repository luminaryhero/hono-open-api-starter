import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { articleTable } from "./article";

export const userTable = pgTable("user_table", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).default("user"),
  bio: text("bio"),
  image: text("image"),
  favorites: integer("favorites").array().default(sql`'{}'::integer[]`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const userRelationsTable = relations(userTable, ({ many }) => ({
  articles: many(articleTable),
}));

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  role: z.enum(["user", "admin"]).default("user"),
  bio: z.string().min(1).max(50).optional(),
  image: z.string().optional(),
  favorites: z.array(z.number()).optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type UserTable = z.infer<typeof userSchema>;
