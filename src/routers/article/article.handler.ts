import { eq, inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type { ArticleCreateRoute, ArticleDeleteRoute, ArticleFavListRoute, ArticleGetRoute, ArticleListByAuthorRoute, ArticleListRoute, ArticleUpdateRoute } from "@/routers/article/article.router";

import { nilThrowError, paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { articleTable } from "@/drizzle/schemas/article";
import { userTable } from "@/drizzle/schemas/user";

/**
 * Get a article by id
 */
export const articleGetHandler: AppRouteHandler<ArticleGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.articleTable.findFirst({
    where: eq(articleTable.id, id),
  });

  nilThrowError(data, `The article not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get article list
 */
export const articleListHandler: AppRouteHandler<ArticleListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.articleTable.findMany({
    orderBy: (articleTable, { asc }) => asc(articleTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new article
 */
export const articleCreateHandler: AppRouteHandler<ArticleCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(articleTable).values(body).returning();
  const data = result[0];

  nilThrowError(data, "The article create filed");

  return successResponse(c, data);
};

/**
 * Update a article
 */
export const articleUpdateHandler: AppRouteHandler<ArticleUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(articleTable).set(body).where(eq(articleTable.id, id)).returning();

  const data = result[0];

  nilThrowError(data, `The article not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a article by id
 */
export const articleDeleteHandler: AppRouteHandler<ArticleDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(articleTable).where(eq(articleTable.id, id)).returning();
  const data = result[0];

  nilThrowError(data, `The article not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get article list  by userId
 */
export const articleListByAuthorHandler: AppRouteHandler<ArticleListByAuthorRoute> = async (c) => {
  const { author } = await c.req.valid("query");

  const result = await db.query.articleTable.findMany({
    where: eq(articleTable.authorId, author),
    orderBy: (articleTable, { asc }) => asc(articleTable.id),
  });

  // 数据分页
  const data = paginate(result);

  return successResponse(c, data);
};

/**
 * Articles Favored by Username
 */
export const articleFavListHandler: AppRouteHandler<ArticleFavListRoute> = async (c) => {
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
