import { eq, inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/article/article.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { articleTable } from "@/drizzle/schemas/article";
import { userTable } from "@/drizzle/schemas/user";

/**
 * Get a article by id
 */
export const articleGetHandler: AppRouteHandler<RT.ArticleGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.articleTable.findFirst({
    where: eq(articleTable.id, id),
    with: {
      comments: true,
      tags: true,
    },
  });

  if (!data) {
    throw new Error(`The article not found,id = ${id}`);
  }

  return successResponse(c, data);
};

/**
 * Get article list
 */
export const articleListHandler: AppRouteHandler<RT.ArticleListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.articleTable.findMany({
    orderBy: (articleTable, { asc }) => asc(articleTable.id),
    with: {
      comments: true,
      tags: true,
    },
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new article
 */
export const articleCreateHandler: AppRouteHandler<RT.ArticleCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(articleTable).values(body).returning();
  const data = result[0];

  if (!data)
    throw new Error("The article create filed");

  return successResponse(c, data);
};

/**
 * Update a article
 */
export const articleUpdateHandler: AppRouteHandler<RT.ArticleUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(articleTable).set(body).where(eq(articleTable.id, id)).returning();

  const data = result[0];

  if (!data)
    throw new Error(`The article not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a article by id
 */
export const articleDeleteHandler: AppRouteHandler<RT.ArticleDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(articleTable).where(eq(articleTable.id, id)).returning();
  const data = result[0];

  if (!data)
    throw new Error(`The article not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get article list  by userId
 */
export const authorArticlesHandler: AppRouteHandler<RT.AuthorArticlesRoute> = async (c) => {
  const { author } = await c.req.valid("query");

  const result = await db.query.articleTable.findMany({
    where: eq(articleTable.authorId, author),
    orderBy: (articleTable, { asc }) => asc(articleTable.id),
    with: {
      comments: true,
    },
  });

  // 数据分页
  const data = paginate(result);

  return successResponse(c, data);
};

/**
 * 新增收藏文章
 */
export const favArticlePostHandler: AppRouteHandler<RT.FavArticlePostRoute> = async (c) => {
  const { slug } = await c.req.valid("param");
  const { username } = await c.req.valid("json");

  // 查询用户
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });
  if (!user)
    throw new Error(`The user not found,username = ${username}`);

  // 查询文章
  const article = await db.query.articleTable.findFirst({
    where: eq(articleTable.slug, slug),
  });
  if (!article)
    throw new Error(`The article not found,slug = ${slug}`);

  // 收藏文章
  const favorites = user.favorites || [];
  if (favorites.includes(article.id)) {
    throw new Error(`The article has been favored,id = ${article.id}`);
  }
  favorites.push(article.id);

  const result = await db
    .update(userTable)
    .set({ favorites })
    .where(eq(userTable.id, user.id))
    .returning();

  const data = result[0];

  return successResponse(c, data);
};

/**
 * 用户收藏文章列表
 */
export const favArticlesHandler: AppRouteHandler<RT.FavArticlesRoute> = async (c) => {
  const { page = 1, pageSize = 10, username } = await c.req.valid("query");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
    orderBy: (userTable, { asc }) => asc(userTable.id),
  });

  if (!user?.favorites?.length)
    return successResponse(c, []);

  const result = await db.query.articleTable.findMany({
    where: inArray(articleTable.id, user?.favorites),
    orderBy: (articleTable, { asc }) => asc(articleTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * 删除收藏文章
 */
export const favArticleDeleteHandler: AppRouteHandler<RT.FavArticleDeleteRoute> = async (c) => {
  const { userId, articleId } = await c.req.valid("json");

  // 查询用户
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
  });
  if (!user)
    throw new Error(`The user not found,id = ${userId}`);

  const favorites = user?.favorites || [];

  const index = favorites.indexOf(articleId);
  if (index === -1) {
    throw new Error(`The article has not been favored,id = ${articleId}`);
  }
  favorites.splice(index, 1);

  const result = await db
    .update(userTable)
    .set({ favorites })
    .where(eq(userTable.id, userId))
    .returning();

  const data = result[0];

  return successResponse(c, data);
};
