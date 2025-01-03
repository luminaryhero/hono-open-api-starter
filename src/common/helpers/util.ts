import type { Context } from "hono";

import { eq } from "drizzle-orm/pg-core/expressions";
import { verify } from "hono/jwt";
import _ from "lodash";

import { dateFormat } from "@/common/helpers/date";
import db from "@/drizzle";
import { userTable } from "@/drizzle/schemas/user";
import env from "@/env";

import type { AppEnv, PR, R } from "../types";

/**
 * 响应数据分页
 */
export function paginate(items: any[], page: number = 1, pageSize: number = 10) {
  return {
    meta: {
      total: items.length,
      page,
      pageSize,
    },
    items: items.slice((page - 1) * pageSize, page * pageSize),
  };
}

/**
 * 统一返回响应数据格式
 */
export function successResponse(c: Context, data: any): any {
  if (data == null || undefined) {
    throw new Error("error");
  }

  const responseData = {
    code: 0,
    data,
    message: "ok",
  };

  const result = serialize(responseData as R | PR);

  return c.json(result);
}

/**
 * 序列化响应数据
 */
function serialize<T extends R | PR>(data: T): T {
  const safeFields = ["password"];

  if ("meta" in data.data) {
    let items = data.data.items;

    items = items.map((item: any) => {
      if (item.createdAt) {
        item.createdAt = dateFormat(item.createdAt);
      }
      if (item.updatedAt) {
        item.updatedAt = dateFormat(item.updatedAt);
      }

      item = _.omit(item, safeFields);

      return item;
    });

    return {
      ...data,
      data: {
        ...data.data,
        items,
      },
    };
  }
  else {
    let item = data.data;

    if (item.createdAt) {
      item.createdAt = dateFormat(item.createdAt);
    }
    if (item.updatedAt) {
      item.updatedAt = dateFormat(item.updatedAt);
    }

    item = _.omit(item, safeFields);

    return {
      ...data,
      data: item,
    };
  }
}

/**
 * 校验Token
 */
export async function verifyToken(token: string, c: Context<AppEnv>): Promise<boolean> {
  if (!token) {
    throw new Error("未传入Token");
  }

  const payload = await verify(token, env.JWT_SECRET);

  const username = payload?.name;
  if (typeof username !== "string")
    return false;

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  c.set("jwtPayload", payload);

  return !!user;
}
