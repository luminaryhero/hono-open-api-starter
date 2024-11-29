import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/tag/tag.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { articleTable } from "@/drizzle/schemas/article";
import { articleToTagTable } from "@/drizzle/schemas/article-to-tag";
import { tagTable } from "@/drizzle/schemas/tag";

/**
 * Get a tag by id
 */
export const tagGetHandler: AppRouteHandler<RT.TagGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.tagTable.findFirst({
    where: eq(tagTable.id, id),
  });

  if (!data)
    throw new Error(`The tag not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get tag list
 */
export const tagListHandler: AppRouteHandler<RT.TagListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.tagTable.findMany({
    orderBy: (tagTable, { asc }) => asc(tagTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new tag
 */
export const tagCreateHandler: AppRouteHandler<RT.TagCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(tagTable).values(body).returning();
  const data = result[0];

  if (!data)
    throw new Error("The tag create filed");

  return successResponse(c, data);
};

/**
 * Update a tag
 */
export const tagUpdateHandler: AppRouteHandler<RT.TagUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(tagTable).set(body).where(eq(tagTable.id, id)).returning();

  const data = result[0];

  if (!data)
    throw new Error(`The tag not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a tag by id
 */
export const tagDeleteHandler: AppRouteHandler<RT.TagDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(tagTable).where(eq(tagTable.id, id)).returning();
  const data = result[0];

  if (!data)
    throw new Error(`The tag not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * 批量保存文章标签
 */
export const articleTagsCreateHandler: AppRouteHandler<RT.ArticleTagsCreateRoute> = async (c) => {
  const {
    articleId,
    tagIds,
  } = await c.req.valid("json");

  await db.transaction(async (tx) => {
    // 删除文章所有标签
    await tx
      .delete(articleToTagTable)
      .where(
        eq(articleToTagTable.articleId, articleId),
      );

    // 插入文章标签
    await tx
      .insert(articleToTagTable)
      .values(tagIds.map(tagId => ({ articleId, tagId })));
  });

  // 查找文章是否存在;
  const article = await db.query.articleTable.findFirst({
    where: eq(articleTable.id, articleId),
    with: { tags: true },
  });
  if (!article)
    throw new Error(`The article not found,id = ${articleId}`);

  return successResponse(c, article);
};
