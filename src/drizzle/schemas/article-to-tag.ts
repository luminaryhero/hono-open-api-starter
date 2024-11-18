import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { z } from "zod";

import { articleTable } from "./article";
import { tagTable } from "./tag";

export const articleToTagTable = pgTable("article_to_tag_table", {
  articleId: integer()
    .notNull()
    .references(() => articleTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  tagId: integer()
    .notNull()
    .references(() => tagTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
}, t => ({
  pk: primaryKey({ columns: [t.articleId, t.tagId] }),
}));

export const articleToTagTableRelations = relations(articleToTagTable, ({ one }) => ({
  article: one(articleTable, {
    fields: [articleToTagTable.articleId],
    references: [articleTable.id],
  }),
  tag: one(tagTable, {
    fields: [articleToTagTable.tagId],
    references: [tagTable.id],
  }),
}));

export const articleToTagSchema = z.object({
  articleId: z.number(),
  tagId: z.number(),
});
