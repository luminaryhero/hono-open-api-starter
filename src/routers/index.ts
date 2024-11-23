import authRouter from "./auth/auth.router";
import captchaRouter from "./captcha/captcha.router";
import taskRouter from "./task/task.router";

const router = [
  taskRouter,
  authRouter,
  captchaRouter,
];

export default router;
