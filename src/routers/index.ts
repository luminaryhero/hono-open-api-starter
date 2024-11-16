import articleRouter from "./article/article.router";
import commentRouter from "./comment/comment.router";
import taskRouter from "./task/task.router";
import userRouter from "./user/user.router";

const routers = [
  taskRouter,
  userRouter,
  articleRouter,
  commentRouter,
];

export default routers;
