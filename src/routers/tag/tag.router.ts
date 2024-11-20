import { createRoute, z } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import { tagSchema } from "@/drizzle/schemas/tag";
import * as handler from "@/routers/tag/tag.handler";

/**
 * 查找标签
 */
const tagGetRoute = createRoute({
  summary: "查找标签",
  tags: ["Tag"],
  method: "get",
  path: "/tag/{id}",
  security: [{ Bearer: [] }],
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(tagSchema),
  },
});

/**
 * 标签列表
 */
const tagListRoute = createRoute({
  summary: "标签列表",
  tags: ["Tag"],
  method: "get",
  path: "/tag",
  security: [{ Bearer: [] }],
  request: {
    query: pageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(tagSchema),
  },
});

/**
 * 新增标签
 */
const tagCreateRoute = createRoute({
  summary: "新增标签",
  tags: ["Tag"],
  method: "post",
  path: "/tag",
  security: [{ Bearer: [] }],
  request: {
    body: jsonContent(
      tagSchema
        .omit({
          id: true,
        }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(tagSchema),
  },
});

/**
 * 更新标签
 */
const tagUpdateRoute = createRoute({
  summary: "更新标签",
  tags: ["Tag"],
  method: "put",
  path: "/tag/{id}",
  security: [{ Bearer: [] }],
  request: {
    params: idParamsSchema,
    body: jsonContent(
      tagSchema
        .omit({
          id: true,
        })
        .partial(),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(tagSchema),
  },
});

/**
 * 删除标签
 */
const tagDeleteRoute = createRoute({
  summary: "删除标签",
  tags: ["Tag"],
  method: "delete",
  path: "/tag/{id}",
  security: [{ Bearer: [] }],
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(tagSchema),
  },
});

/**
 * 批量保存文章标签
 */
const articleTagsCreateRoute = createRoute({
  summary: "批量保存文章标签",
  tags: ["Tag"],
  method: "post",
  path: "/articleTags",
  request: {
    body: jsonContent(
      z.object({
        articleId: z.number(),
        tagIds: z.array(z.number()),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(tagSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(tagGetRoute, handler.tagGetHandler)
    .openapi(tagListRoute, handler.tagListHandler)
    .openapi(tagCreateRoute, handler.tagCreateHandler)
    .openapi(tagUpdateRoute, handler.tagUpdateHandler)
    .openapi(tagDeleteRoute, handler.tagDeleteHandler)
    .openapi(articleTagsCreateRoute, handler.articleTagsCreateHandler);

export type TagGetRoute = typeof tagGetRoute;
export type TagListRoute = typeof tagListRoute;
export type TagCreateRoute = typeof tagCreateRoute;
export type TagUpdateRoute = typeof tagUpdateRoute;
export type TagDeleteRoute = typeof tagDeleteRoute;
export type ArticleTagsCreateRoute = typeof articleTagsCreateRoute;

export default router;
