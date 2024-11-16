import { createRoute, z } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import IdParamsSchema from "@/common/schemas/id-params";
import PageParamsSchema from "@/common/schemas/page-params";
import SlugParamsSchema from "@/common/schemas/slug-params";
import { articleSchema } from "@/drizzle/schemas/article";
import * as handler from "@/routers/article/article.handler";

const articleGetRoute = createRoute({
  summary: "查找文章",
  tags: ["Article"],
  method: "get",
  path: "/article/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

const articleListRoute = createRoute({
  summary: "文章列表",
  tags: ["Article"],
  method: "get",
  path: "/article",
  request: {
    query: PageParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(articleSchema),
  },
});

const articleCreateRoute = createRoute({
  summary: "新增文章",
  tags: ["Article"],
  method: "post",
  path: "/article",
  request: {
    body: jsonContent(
      articleSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

const articleUpdateRoute = createRoute({
  summary: "更新文章",
  tags: ["Article"],
  method: "put",
  path: "/article/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContent(
      articleSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial(),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

const articleDeleteRoute = createRoute({
  summary: "删除文章",
  tags: ["Article"],
  method: "delete",
  path: "/article/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

/**
 * 作者文章列表
 */
const authorArticlesRoute = createRoute({
  summary: "作者文章列表",
  tags: ["Article"],
  method: "get",
  path: "/authorArticles",
  request: {
    query: z.object({
      author: z.string().pipe(z.coerce.number()),
    })
      .merge(PageParamsSchema),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(articleSchema),
  },
});

/**
 * 收藏文章
 */
const favArticlePostRoute = createRoute({
  summary: "收藏文章",
  tags: ["Article"],
  method: "post",
  path: "/favArticles/{slug}",
  request: {
    params: SlugParamsSchema,
    body: jsonContent(
      z.object({
        username: z.string(),
      })
        .merge(PageParamsSchema),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

/**
 * 用户收藏文章列表
 */
const favArticlesRoute = createRoute({
  summary: "用户收藏文章列表",
  tags: ["Article"],
  method: "get",
  path: "/favArticles",
  request: {
    query: z.object({
      username: z.string(),
    })
      .merge(PageParamsSchema),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(articleGetRoute, handler.articleGetHandler)
    .openapi(articleListRoute, handler.articleListHandler)
    .openapi(articleCreateRoute, handler.articleCreateHandler)
    .openapi(articleUpdateRoute, handler.articleUpdateHandler)
    .openapi(articleDeleteRoute, handler.articleDeleteHandler)
    .openapi(authorArticlesRoute, handler.authorArticlesHandler)
    .openapi(favArticlePostRoute, handler.favArticlePostHandler)
    .openapi(favArticlesRoute, handler.favArticlesHandler);

export type ArticleGetRoute = typeof articleGetRoute;
export type ArticleListRoute = typeof articleListRoute;
export type ArticleCreateRoute = typeof articleCreateRoute;
export type ArticleUpdateRoute = typeof articleUpdateRoute;
export type ArticleDeleteRoute = typeof articleDeleteRoute;
export type AuthorArticlesRoute = typeof authorArticlesRoute;
export type FavArticlePostRoute = typeof favArticlePostRoute;
export type FavArticlesRoute = typeof favArticlesRoute;

export default router;
