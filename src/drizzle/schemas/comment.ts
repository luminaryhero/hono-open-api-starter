import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { articleTable } from "./article";

export const commentTable = pgTable("comment_table", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
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
