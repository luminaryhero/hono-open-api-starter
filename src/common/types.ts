import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { JwtVariables } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

export interface JWT_PAYLOAD extends JWTPayload {
  sub: number;
  name: string;
  role: string;
  exp: number;
}

/**
 * App环境变量
 */
export interface AppEnv {
  Variables: {
    logger: PinoLogger;
    jwt: JwtVariables<JWT_PAYLOAD>;
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

/**
 * 分页响应数据格式接口
 */
export interface PR {
  code: number;
  data: {
    meta: object;
    items: any[];
  };
  message: string;
}
