import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

/**
 * App环境变量
 */
export interface AppEnv {
  Variables: {
    logger: PinoLogger;
  };
}

/**
 * App类型
 */
export type AppOpenAPI = OpenAPIHono<AppEnv>;

/**
 * 路由处理函数类型
 */
export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppEnv>;

/**
 * 响应数据格式接口
 */
export interface R {
  code: number;
  data: any;
  message: string;
}
