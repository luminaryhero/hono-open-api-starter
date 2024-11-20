import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/role/role.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { roleTable } from "@/drizzle/schemas/role";

/**
 * Get a role by id
 */
export const roleGetHandler: AppRouteHandler<RT.RoleGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.roleTable.findFirst({
    where: eq(roleTable.id, id),
    with: {
      permissions: true,
    },
  });

  if (!data)
    throw new Error(`The role not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get role list
 */
export const roleListHandler: AppRouteHandler<RT.RoleListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.roleTable.findMany({
    orderBy: (roleTable, { asc }) => asc(roleTable.id),
    with: {
      permissions: true,
    },
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new role
 */
export const roleCreateHandler: AppRouteHandler<RT.RoleCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(roleTable).values(body).returning();
  const data = result[0];

  if (!data)
    throw new Error("The role create filed");

  return successResponse(c, data);
};

/**
 * Update a role
 */
export const roleUpdateHandler: AppRouteHandler<RT.RoleUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(roleTable).set(body).where(eq(roleTable.id, id)).returning();

  const data = result[0];

  if (!data)
    throw new Error(`The role not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a role by id
 */
export const roleDeleteHandler: AppRouteHandler<RT.RoleDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(roleTable).where(eq(roleTable.id, id)).returning();
  const data = result[0];

  if (!data)
    throw new Error(`The role not found,id = ${id}`);

  return successResponse(c, data);
};
