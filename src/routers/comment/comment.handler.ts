import { and, eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/comment/comment.router";

import { nilThrowError, paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { articleTable } from "@/drizzle/schemas/article";
import { commentTable } from "@/drizzle/schemas/comment";

/**
 * Get comment list
 */
export const commentListHandler: AppRouteHandler<RT.CommentListRoute> = async (c) => {
  const { page = 1, pageSize = 10, articleId } = await c.req.valid("query");

  const result = await db.query.commentTable.findMany({
    where: eq(commentTable.articleId, articleId),
    orderBy: (commentTable, { asc }) => asc(commentTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new comment
 */
export const commentCreateHandler: AppRouteHandler<RT.CommentCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(commentTable).values(body).returning();
  const data = result[0];

  nilThrowError(data, "The comment create filed");

  return successResponse(c, data);
};

/**
 * Delete a comment by id
 */
export const commentDeleteHandler: AppRouteHandler<RT.CommentDeleteRoute> = async (c) => {
  const { articleId, commentId } = await c.req.valid("json");

  // 查找评论是否存在;
  const result = await db
    .delete(commentTable)
    .where(
      and(
        eq(commentTable.id, commentId),
        eq(commentTable.articleId, articleId),
      ),
    )
    .returning();
  const data = result[0];
  nilThrowError(data, `The article comment not found,id = ${commentId}`);

  return successResponse(c, data);
};
