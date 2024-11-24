import { eq } from "drizzle-orm";
import { stream } from "hono/streaming";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/profile/profile.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { profileTable } from "@/drizzle/schemas/profile";

/**
 * 更新用户信息
 */
export const profileUpdateHandler: AppRouteHandler<RT.ProfileUpdateRoute> = async (c) => {
  const { sub } = c.get("jwtPayload");
  const body = await c.req.valid("json");

  const result = await db.update(profileTable)
    .set(body)
    .where(
      eq(profileTable.username, sub),
    );

  const data = result[0];

  if (!data)
    throw new Error(`更新用户信息失败`);

  return successResponse(c, data);
};

/**
 * 更新头像
 */
export const avatarUpdateHandler: AppRouteHandler<RT.AvatarUpdateRoute> = async (c) => {
  const { sub } = c.get("jwtPayload");
  const body = await c.req.parseBody();

  console.log(sub);
  console.log(body.file);

  return successResponse(c, {});
};
