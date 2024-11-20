import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/auth/auth.router";

import { successResponse } from "@/common/helpers/util";
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
  if (user === undefined) {
    throw new Error(`username or password is incorrect`);
  }

  // 校验用户名和密码是否匹配
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    throw new Error(`username or password is incorrect`);
  }

  const payload = {
    sub: user.id,
    name: user.username,
    role: user.role || "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 30 minutes
  };

  // 生成 token
  const token = await sign(payload, env.JWT_SECRET);

  return successResponse(c, { token });
};

/**
 * 注册
 */
export const registerHandler: AppRouteHandler<RT.RegisterRoute> = async (c) => {
  const { username, password } = await c.req.valid("json");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  // 校验用户名是否注册
  if (user !== undefined) {
    throw new Error(`The username is taken,username=${username}`);
  }

  // 密码加密
  const hash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(userTable)
    .values({
      username,
      password: hash,
    })
    .returning();

  return successResponse(c, result[0]);
};

/**
 * 当前用户信息
 */
export const userInfoHandler: AppRouteHandler<RT.UserInfoRoute> = async (c) => {
  const payload = c.get("jwtPayload");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, payload.name),
  });
  if (user === undefined) {
    throw new Error(`The user not found`);
  }

  return successResponse(c, user);
};
