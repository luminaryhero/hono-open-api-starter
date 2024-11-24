import { eq, inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/user/user.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { captchaTable } from "@/drizzle/schemas/captcha";
import { userTable } from "@/drizzle/schemas/user";

/**
 * 更换绑定手机号
 */
export const rebindPhoneHandler: AppRouteHandler<RT.RebindPhoneRoute> = async (c) => {
  const { oldcaptcha, captcha, phone } = await c.req.valid("json");

  const { sub: username } = c.get("jwtPayload");

  // 查询用户
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  if (!user)
    throw new Error(`The user not found`);

  // 校验旧手机的验证码
  const oldPhone = user.phone;
  const captchaRow = await db.query.captchaTable.findFirst({
    where: eq(captchaTable.phone, oldPhone),
  });

  if (captchaRow === undefined) {
    throw new Error(`captcha is incorrect`);
  }

  if (captchaRow.expiredAt < new Date()) {
    throw new Error(`captcha is expired`);
  }

  if (oldcaptcha !== captchaRow.code) {
    throw new Error(`captcha is incorrect`);
  }

  // 校验新手机的验证码
  const newCaptchaRow = await db.query.captchaTable.findFirst({
    where: eq(captchaTable.phone, phone),
  });

  if (newCaptchaRow === undefined) {
    throw new Error(`captcha is incorrect`);
  }

  if (newCaptchaRow.expiredAt < new Date()) {
    throw new Error(`captcha is expired`);
  }

  if (newCaptchaRow.code !== captcha) {
    throw new Error(`captcha is incorrect`);
  }

  await db.delete(captchaTable).where(
    inArray(captchaTable.phone, [oldPhone, phone]),
  );

  // 重新绑定手机号
  const userRow = await db.query.userTable.findFirst({
    where: eq(userTable.phone, phone),
  });
  if (userRow !== undefined) {
    throw new Error(`The phone is taken,phone=${phone}`);
  }

  const result
    = await db.update(userTable)
      .set({ phone })
      .where(
        eq(userTable.id, user.id),
      )
      .returning();

  return successResponse(c, result);
};
