import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/user/user.router";

import { nilThrowError, paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { userTable } from "@/drizzle/schemas/user";

/**
 * Get a user by id
 */
export const userGetHandler: AppRouteHandler<RT.UserGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });

  nilThrowError(data, `The user not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get user list
 */
export const userListHandler: AppRouteHandler<RT.UserListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.userTable.findMany({
    orderBy: (userTable, { asc }) => asc(userTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new user
 */
export const userCreateHandler: AppRouteHandler<RT.UserCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(userTable).values(body).returning();
  const data = result[0];

  nilThrowError(data, "The user create filed");

  return successResponse(c, data);
};

/**
 * Update a user
 */
export const userUpdateHandler: AppRouteHandler<RT.UserUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(userTable).set(body).where(eq(userTable.id, id)).returning();

  const data = result[0];

  nilThrowError(data, `The user not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a user by id
 */
export const userDeleteHandler: AppRouteHandler<RT.UserDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(userTable).where(eq(userTable.id, id)).returning();
  const data = result[0];

  nilThrowError(data, `The user not found,id = ${id}`);

  return successResponse(c, data);
};
