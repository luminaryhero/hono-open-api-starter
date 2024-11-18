import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { z } from "zod";

import { articleToTagTable } from "./article-to-tag";

export const tagTable = pgTable("tag_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const tagRelationsTable = relations(tagTable, ({ many }) => ({
  articles: many(articleToTagTable),
}));

export const tagSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
});

export type TagTable = typeof tagTable;
