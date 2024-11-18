import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { now } from "@/common/helpers/date";

import { articleToTagTable } from "./article-to-tag";
import { commentSchema, commentTable } from "./comment";
import { tagSchema } from "./tag";
import { userTable } from "./user";

export const articleTable = pgTable("article_table", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").$defaultFn(now),
  updatedAt: timestamp("updated_at").$defaultFn(now).$onUpdate(now),
});

export const articleRelationsTable = relations(articleTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [articleTable.authorId],
    references: [userTable.id],
  }),
  comments: many(commentTable),
  tags: many(articleToTagTable),
}));

export const articleSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(30),
  slug: z.string().min(1).max(30),
  description: z.string().min(1).max(50),
  authorId: z.number(),
  favored: z.boolean().default(false),
  comments: z.array(commentSchema).optional(),
  tags: z.array(tagSchema).optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type ArticleTable = typeof articleTable;
