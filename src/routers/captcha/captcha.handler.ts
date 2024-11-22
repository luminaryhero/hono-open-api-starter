import { and, eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/captcha/captcha.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { captchaTable } from "@/drizzle/schemas/captcha";

/**
 * 发送验证码
 */
export const captchaSendHandler: AppRouteHandler<RT.CaptchaSendRoute> = async (c) => {
  const { phone } = await c.req.valid("json");

  const captcha = await db.query.captchaTable.findFirst({
    where: eq(captchaTable.phone, phone),
  });

  // 随机生成6位验证码
  const randomCode = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

  // 存在验证码
  if (captcha) {
    // 如果过期则重新生成验证码,更新过期时间
    if (captcha.expiredAt < new Date()) {
      await db.update(captchaTable).set({
        code: randomCode,
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      }).where(
        eq(captchaTable.phone, phone),
      );

      c.var.logger.warn(`您的验证码为${captcha.code},5分钟内有效`);
    }
    else if (captcha.expiredAt > new Date(Date.now() + 4 * 60 * 1000)) {
      // 小于1分钟提示请勿频繁发送
      throw new Error("Please do not send too frequently");
    }
    else {
      // 大于1分钟且未过期，更新过期时间
      await db.update(captchaTable).set({
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      }).where(
        eq(captchaTable.phone, phone),
      );
      c.var.logger.warn(`您的验证码为${captcha.code},5分钟内有效`);
    }
  }
  else {
    await db.insert(captchaTable).values({
      phone,
      code: randomCode,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5分钟过期
    });
    c.var.logger.warn(`您的验证码为${randomCode},5分钟内有效`);
  }

  return successResponse(c, {});
};

/**
 * 验证验证码
 */
export const captchaVerifyHandler: AppRouteHandler<RT.CaptchaVerifyRoute> = async (c) => {
  const { phone, captcha: code } = await c.req.valid("json");

  const captcha = await db.query.captchaTable.findFirst({
    where: and(
      eq(captchaTable.phone, phone),
      eq(captchaTable.code, code),
    ),
  });

  if (captcha === undefined) {
    throw new Error(`captcha is incorrect`);
  }

  if (captcha.expiredAt < new Date()) {
    throw new Error(`captcha is expired`);
  }

  return successResponse(c, {});
};
