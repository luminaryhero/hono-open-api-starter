import { configureOpenAPI } from "@/common/core/configure-openapi";

import { createApp } from "./lib/core/create-app";
import { registerLogger } from "./lib/core/register-logger";
import { registerRouter } from "./lib/core/register-router";
import routers from "./routers";

const app = createApp();
configureOpenAPI(app);
registerLogger(app);
registerRouter(app, routers);

app.get("/error", (c) => {
  c.var.logger.error("error log");
  throw new Error("Oh No!");
});

export default app;
