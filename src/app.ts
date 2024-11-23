import { bearerAuth } from "hono/bearer-auth";
import { except } from "hono/combine";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { prettyJSON } from "hono/pretty-json";

import { configureOpenAPI } from "@/common/core/configure-openapi";
import { createApp } from "@/common/core/create-app";
import { verifyToken } from "@/common/helpers/util";
import env from "@/env";
import routers from "@/routers";

import { pinoLoggerMiddleware } from "./common/middlewares/pino-logger";

const app = createApp();

// 配置openapi文档
configureOpenAPI(app);

// 配置pino-logger中间件
app.use(pinoLoggerMiddleware);

// 配置全局中间件
app.use(
  cors(),
  prettyJSON(),
);

// 配置路由
app.use(
  "/auth/*",
  jwt({
    secret: env.JWT_SECRET,
  }),
);
app.use(
  "/api/*",
  except(
    [
      "/api/public/*",
      "/api/auth/*",
      "/api/captcha/*",
    ],
    bearerAuth({
      verifyToken,
    }),
  ),
);

routers.forEach((router) => {
  app.route("/api", router);
});

export default app;
