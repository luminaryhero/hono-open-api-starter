import { createRoute, z } from "@hono/zod-openapi";

import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/schema";
import * as HttpStatusCodes from "@/common/lib/http-status-codes";
import IdParamsSchema from "@/common/schemas/id-params";
import PageParamsSchema from "@/common/schemas/page-params";
import { articleSchema } from "@/drizzle/schemas/article";
import * as articleHandler from "@/routers/article/article.handler";

const articleGetRoute = createRoute({
  summary: "查找",
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
  summary: "列表",
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
  summary: "新增",
  tags: ["Article"],
  method: "post",
  path: "/article",
  request: {
    body: jsonContent(
      articleSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

const articleUpdateRoute = createRoute({
  summary: "更新",
  tags: ["Article"],
  method: "put",
  path: "/article/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContent(articleSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(articleSchema),
  },
});

const articleDeleteRoute = createRoute({
  summary: "删除",
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

const articleListByAuthorRoute = createRoute({
  summary: "根据作者获取文章列表",
  tags: ["Article"],
  method: "get",
  path: "/articlesByAuthor",
  request: {
    query: z.object({
      author: z.string().pipe(z.coerce.number()),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(articleSchema),
  },
});

const articleFavListRoute = createRoute({
  summary: "用户收藏的文章列表",
  tags: ["Article"],
  method: "get",
  path: "/favArticlesByUsername",
  request: {
    query: z.object({
      username: z.string(),
    }).merge(PageParamsSchema),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonPageResponse(articleSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(articleGetRoute, articleHandler.articleGetHandler)
    .openapi(articleListRoute, articleHandler.articleListHandler)
    .openapi(articleCreateRoute, articleHandler.articleCreateHandler)
    .openapi(articleUpdateRoute, articleHandler.articleUpdateHandler)
    .openapi(articleDeleteRoute, articleHandler.articleDeleteHandler)
    .openapi(articleListByAuthorRoute, articleHandler.articleListByAuthorHandler)
    .openapi(articleFavListRoute, articleHandler.articleFavListHandler);

export type ArticleGetRoute = typeof articleGetRoute;
export type ArticleListRoute = typeof articleListRoute;
export type ArticleCreateRoute = typeof articleCreateRoute;
export type ArticleUpdateRoute = typeof articleUpdateRoute;
export type ArticleDeleteRoute = typeof articleDeleteRoute;
export type ArticleListByAuthorRoute = typeof articleListByAuthorRoute;
export type ArticleFavListRoute = typeof articleFavListRoute;

export default router;
