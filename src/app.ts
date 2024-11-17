import { bearerAuth } from "hono/bearer-auth";
import { jwt } from "hono/jwt";

import { configureOpenAPI } from "@/common/core/configure-openapi";
import { createApp } from "@/common/core/create-app";
import { registerLogger } from "@/common/core/register-logger";
import { registerMiddlewares } from "@/common/core/register-middleware";
import { registerRouter } from "@/common/core/register-router";
import { asyncVerifyToken } from "@/common/helpers/util";
import env from "@/env";
import routers from "@/routers";

const app = createApp();
app.use("/api/user/*", bearerAuth({
  verifyToken: asyncVerifyToken,
}));

app.use(
  "/auth/*",
  jwt({
    secret: env.JWT_SECRET,
  }),
);

configureOpenAPI(app);
registerLogger(app);
registerMiddlewares(app);
registerRouter(app, routers);

export default app;
