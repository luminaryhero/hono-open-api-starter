import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/permission/permission.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { permissionTable } from "@/drizzle/schemas/permission";

/**
 * Get a permission by id
 */
export const permissionGetHandler: AppRouteHandler<RT.PermissionGetRoute> = async (c) => {
  const { id } = await c.req.valid("param");

  const data = await db.query.permissionTable.findFirst({
    where: eq(permissionTable.id, id),
  });

  if (!data)
    throw new Error(`The permission not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Get permission list
 */
export const permissionListHandler: AppRouteHandler<RT.PermissionListRoute> = async (c) => {
  const { page = 1, pageSize = 10 } = await c.req.valid("query");

  const result = await db.query.permissionTable.findMany({
    orderBy: (permissionTable, { asc }) => asc(permissionTable.id),
  });

  // 数据分页
  const data = paginate(result, page, pageSize);

  return successResponse(c, data);
};

/**
 * Create a new permission
 */
export const permissionCreateHandler: AppRouteHandler<RT.PermissionCreateRoute> = async (c) => {
  const body = await c.req.valid("json");

  const result = await db.insert(permissionTable).values(body).returning();
  const data = result[0];

  if (!data)
    throw new Error("The permission create filed");

  return successResponse(c, data);
};

/**
 * Update a permission
 */
export const permissionUpdateHandler: AppRouteHandler<RT.PermissionUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const body = await c.req.valid("json");

  const result = await db.update(permissionTable).set(body).where(eq(permissionTable.id, id)).returning();

  const data = result[0];

  if (!data)
    throw new Error(`The permission not found,id = ${id}`);

  return successResponse(c, data);
};

/**
 * Delete a permission by id
 */
export const permissionDeleteHandler: AppRouteHandler<RT.PermissionDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  const result = await db.delete(permissionTable).where(eq(permissionTable.id, id)).returning();
  const data = result[0];

  if (!data)
    throw new Error(`The permission not found,id = ${id}`);

  return successResponse(c, data);
};
