import articleRouter from "./article/article.router";
import taskRouter from "./task/task.router";
import userRouter from "./user/user.router";

const routers = [
  taskRouter,
  userRouter,
  articleRouter,
];

export default routers;
