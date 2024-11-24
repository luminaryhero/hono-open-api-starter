import authRouter from "./auth/auth.router";
import captchaRouter from "./captcha/captcha.router";
import profileRouter from "./profile/profile.router";
import taskRouter from "./task/task.router";

const router = [
  taskRouter,
  authRouter,
  captchaRouter,
  profileRouter,
];

export default router;
