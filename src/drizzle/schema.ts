import { sql } from "drizzle-orm";
import { boolean, foreignKey, integer, pgTable, primaryKey, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const commentTable = pgTable("comment_table", {
  id: serial().primaryKey().notNull(),
  body: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
});

export const taskTable = pgTable("task_table", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  done: boolean().default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
}, (table) => {
  return {
    taskTableNameUnique: unique("task_table_name_unique").on(table.name),
  };
});

export const userTable = pgTable("user_table", {
  id: serial().primaryKey().notNull(),
  username: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  bio: text(),
  image: text(),
  favorites: integer().array().default([]),
}, (table) => {
  return {
    userTableUsernameUnique: unique("user_table_username_unique").on(table.username),
    userTableEmailUnique: unique("user_table_email_unique").on(table.email),
  };
});

export const tagTable = pgTable("tag_table", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
}, (table) => {
  return {
    tagTableNameUnique: unique("tag_table_name_unique").on(table.name),
  };
});

export const articleTable = pgTable("article_table", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  authorId: integer("author_id").notNull(),
}, (table) => {
  return {
    articleTableTitleUnique: unique("article_table_title_unique").on(table.title),
    articleTableSlugUnique: unique("article_table_slug_unique").on(table.slug),
  };
});

export const articleToTagTable = pgTable("article_to_tag_table", {
  articleId: integer("article_id").notNull(),
  tagId: integer("tag_id").notNull(),
}, (table) => {
  return {
    articleToTagTableArticleIdArticleTableIdFk: foreignKey({
      columns: [table.articleId],
      foreignColumns: [articleTable.id],
      name: "article_to_tag_table_article_id_article_table_id_fk",
    }).onUpdate("cascade").onDelete("cascade"),
    articleToTagTableTagIdTagTableIdFk: foreignKey({
      columns: [table.tagId],
      foreignColumns: [tagTable.id],
      name: "article_to_tag_table_tag_id_tag_table_id_fk",
    }).onUpdate("cascade").onDelete("cascade"),
    articleToTagTableArticleIdTagIdPk: primaryKey({ columns: [table.articleId, table.tagId], name: "article_to_tag_table_article_id_tag_id_pk" }),
  };
});
