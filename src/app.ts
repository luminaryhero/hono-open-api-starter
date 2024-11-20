import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { prettyJSON } from "hono/pretty-json";

import { configureOpenAPI } from "@/common/core/configure-openapi";
import { createApp } from "@/common/core/create-app";
import { verifyToken } from "@/common/helpers/util";
import env from "@/env";
import routers from "@/routers";

import { pinoLoggerMiddleware } from "./common/middlewares/pino-logger";
import authRouter from "./routers/auth/auth.router";

const app = createApp();

// 配置openapi文档
configureOpenAPI(app);

// 配置pino-logger中间件
app.use(pinoLoggerMiddleware);

// 配置全局中间件
app.use(cors(), prettyJSON());

// 配置不需要权限路由
app
  .route("/api", authRouter)
  .use(
    jwt({
      secret: env.JWT_SECRET,
    }),
  );

// 配置权限路由
routers.forEach((router) => {
  app
    .route("/api", router)
    .use(
      bearerAuth({
        verifyToken,
      }),
    );
});

export default app;
