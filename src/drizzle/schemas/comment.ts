import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { now } from "@/common/helpers/date";

import { articleTable } from "./article";

export const commentTable = pgTable("comment_table", {
  id: serial().primaryKey(),
  body: text().notNull(),
  userId: integer().notNull(),
  articleId: integer(),
  createdAt: timestamp("created_at").$defaultFn(now),
});

export const commentRelations = relations(commentTable, ({ one }) => ({
  article: one(articleTable, {
    fields: [commentTable.articleId],
    references: [articleTable.id],
  }),
}));

export const commentSchema = z.object({
  id: z.number(),
  body: z.string().min(1).max(100),
  userId: z.number(),
  articleId: z.number(),
  createdAt: z.date().nullable(),
});

export type CommentTable = typeof commentTable;
