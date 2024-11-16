import { createRoute, z } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import IdParamsSchema from "@/common/schemas/id-params";
import PageParamsSchema from "@/common/schemas/page-params";
import { commentSchema } from "@/drizzle/schemas/comment";
import * as handler from "@/routers/comment/comment.handler";

const commentGetRoute = createRoute({
  summary: "查找评论",
  tags: ["Comment"],
  method: "get",
  path: "/comment/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(commentSchema),
  },
});

const commentListRoute = createRoute({
  summary: "评论列表",
  tags: ["Comment"],
  method: "get",
  path: "/comment",
  request: {
    query: z.object({
      articleId: z.string().pipe(z.coerce.number()),
    })
      .merge(PageParamsSchema),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(commentSchema),
  },
});

const commentCreateRoute = createRoute({
  summary: "新增评论",
  tags: ["Comment"],
  method: "post",
  path: "/comment",
  request: {
    body: jsonContent(
      commentSchema
        .omit({
          id: true,
          createdAt: true,
        }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(commentSchema),
  },
});

const commentDeleteRoute = createRoute({
  summary: "删除评论",
  tags: ["Comment"],
  method: "delete",
  path: "/comment",
  request: {
    body: jsonContent(
      z.object({
        commentId: z.number(),
        articleId: z.number(),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(commentSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(commentGetRoute, handler.commentGetHandler)
    .openapi(commentListRoute, handler.commentListHandler)
    .openapi(commentCreateRoute, handler.commentCreateHandler)
    .openapi(commentDeleteRoute, handler.commentDeleteHandler);

export type CommentGetRoute = typeof commentGetRoute;
export type CommentListRoute = typeof commentListRoute;
export type CommentCreateRoute = typeof commentCreateRoute;
export type CommentDeleteRoute = typeof commentDeleteRoute;

export default router;
