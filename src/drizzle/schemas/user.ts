import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { now } from "@/common/helpers/date";

import { articleTable } from "./article";

export const userTable = pgTable("user_table", {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  password: text().notNull(),
  bio: text(),
  image: text(),
  favorites: integer().array().default(sql`'{}'::integer[]`),
  createdAt: timestamp("created_at").$defaultFn(now),
  updatedAt: timestamp("updated_at").$defaultFn(now).$onUpdate(now),
});

export const userRelationsTable = relations(userTable, ({ many }) => ({
  articles: many(articleTable),
}));

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  bio: z.string().min(1).max(50).optional(),
  image: z.string().optional(),
  favorites: z.array(z.number()).optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type UserTable = z.infer<typeof userSchema>;
