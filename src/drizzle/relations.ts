import { relations } from "drizzle-orm/relations";

import { articleTable, articleToTagTable, tagTable } from "./schema";

export const articleToTagTableRelations = relations(articleToTagTable, ({ one }) => ({
  articleTable: one(articleTable, {
    fields: [articleToTagTable.articleId],
    references: [articleTable.id],
  }),
  tagTable: one(tagTable, {
    fields: [articleToTagTable.tagId],
    references: [tagTable.id],
  }),
}));

export const articleTableRelations = relations(articleTable, ({ many }) => ({
  articleToTagTables: many(articleToTagTable),
}));

export const tagTableRelations = relations(tagTable, ({ many }) => ({
  articleToTagTables: many(articleToTagTable),
}));
