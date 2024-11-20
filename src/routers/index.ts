import articleRouter from "./article/article.router";
import commentRouter from "./comment/comment.router";
import permissionRouter from "./permission/permission.router";
import roleRouter from "./role/role.router";
import tagRouter from "./tag/tag.router";
import taskRouter from "./task/task.router";
import userRouter from "./user/user.router";

const routers = [
  taskRouter,
  userRouter,
  articleRouter,
  commentRouter,
  tagRouter,
  roleRouter,
  permissionRouter,
];

export default routers;
