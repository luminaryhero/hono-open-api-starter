import * as bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { getContext } from "hono/context-storage";
import { sign, verify } from "hono/jwt";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/auth/auth.router";

import { generateToken, successResponse, verifyToken } from "@/common/helpers/util";
import db from "@/drizzle";
import { captchaTable } from "@/drizzle/schemas/captcha";
import { userTable } from "@/drizzle/schemas/user";
import env from "@/env";

/**
 * 邮箱登录
 */
export const emailLoginHandler: AppRouteHandler<RT.EmailLoginRoute> = async (c) => {
  const { email, password } = await c.req.valid("json");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
  if (user === undefined) {
    throw new Error(`email or password is incorrect`);
  }

  // 校验用户名和密码是否匹配
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    throw new Error(`email or password is incorrect`);
  }

  // 生成 token
  const accessToken = await generateToken(user.username, user.role);

  // 生成refreshToken
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const refreshToken = await generateToken(user.username, user.role, exp);

  return successResponse(c, { accessToken, refreshToken });
};

/**
 * 手机登录
 */
export const phoneLoginHandler: AppRouteHandler<RT.PhoneLoginRoute> = async (c) => {
  const { phone, password, captcha } = await c.req.valid("json");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.phone, phone),
  });
  if (user === undefined) {
    throw new Error(`The user not found`);
  }

  if (captcha) {
    // 校验验证码
    const captchaRow = await db.query.captchaTable.findFirst({
      where: and(
        eq(captchaTable.phone, phone),
        eq(captchaTable.code, captcha),
      ),
    });

    if (captchaRow === undefined) {
      throw new Error(`captcha is incorrect`);
    }

    if (captchaRow.expiredAt < new Date()) {
      throw new Error(`captcha is expired`);
    }

    await db.delete(captchaTable).where(eq(captchaTable.phone, phone));
  }
  else {
    // 校验密码是否匹配
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw new Error(`phone or password is incorrect`);
    }
  }

  // 生成 token
  const accessToken = await generateToken(user.username, user.role);

  // 生成refreshToken
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const refreshToken = await generateToken(user.username, user.role, exp);

  return successResponse(c, { accessToken, refreshToken });
};

/**
 * 手机注册
 */
export const registerHandler: AppRouteHandler<RT.RegisterRoute> = async (c) => {
  const { username, password, phone, captcha } = await c.req.valid("json");

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.phone, phone),
  });

  // 校验用户名是否注册
  if (user !== undefined) {
    throw new Error(`The phone is taken,phone=${phone}`);
  }

  // 校验验证码
  const captchaRow = await db.query.captchaTable.findFirst({
    where: and(
      eq(captchaTable.phone, phone),
      eq(captchaTable.code, captcha),
    ),
  });

  if (captchaRow === undefined) {
    throw new Error(`captcha is incorrect`);
  }

  if (captchaRow.expiredAt < new Date()) {
    throw new Error(`captcha is expired`);
  }

  await db.delete(captchaTable).where(eq(captchaTable.phone, phone));

  // 密码加密
  const hash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(userTable)
    .values({
      username,
      password: hash,
      phone,
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

/**
 * 刷新token
 */
export const refreshTokenHandler: AppRouteHandler<RT.RefreshTokenRoute> = async (c) => {
  const { refreshToken } = await c.req.valid("json");

  const payload = await verify(refreshToken, env.JWT_SECRET);
  if (!payload) {
    throw new Error(`The token is invalid`);
  }

  const username = payload?.name;
  if (typeof username !== "string")
    throw new Error(`The token is invalid`);

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  if (user === undefined) {
    throw new Error(`The user not found`);
  }

  // 生成 token
  const accessToken = await generateToken(username, user.role);

  return successResponse(c, { accessToken });
};
