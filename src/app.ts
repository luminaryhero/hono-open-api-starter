import { configureOpenAPI } from "@/lib/core/configure-openapi";

import { createApp } from "./lib/core/create-app";
import index from "./routes/index.route";
import task from "./routes/task.route";

const routes = [
  index,
  task,
];

const app = createApp();
configureOpenAPI(app);

routes.forEach(route => app.route("/api", route));

app.get("/error", (c) => {
  c.var.logger.error("error log");
  throw new Error("Oh No!");
});

export default app;
