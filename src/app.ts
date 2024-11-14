import { configureOpenAPI } from "@/common/core/configure-openapi";
import { createApp } from "@/common/core/create-app";
import { registerLogger } from "@/common/core/register-logger";
import { registerMiddlewares } from "@/common/core/register-middleware";
import { registerRouter } from "@/common/core/register-router";

import routers from "./routers";

const app = createApp();
configureOpenAPI(app);
registerLogger(app);
registerMiddlewares(app);
registerRouter(app, routers);

export default app;
