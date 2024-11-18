import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";

import type { AppRouteHandler, JWT_PAYLOAD } from "@/common/types";
import type * as RT from "@/routers/auth/auth.router";

import { nilThrowError, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { userTable } from "@/drizzle/schemas/user";
import env from "@/env";

/**
 * 登录
 */
export const loginHandler: AppRouteHandler<RT.LoginRoute> = async (c) => {
  const { username, password } = await c.req.valid("json");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  // 校验用户名和密码是否匹配
  if (user === undefined || password !== user.password) {
    throw new Error(`username or password is incorrect`);
  }

  const payload: JWT_PAYLOAD = {
    sub: username,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  };

  // 生成 token
  const token = await sign(payload, env.JWT_SECRET);

  return successResponse(c, { token });
};