import { eq, inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/common/types";
import type * as RT from "@/routers/role/role.router";

import { paginate, successResponse } from "@/common/helpers/util";
import db from "@/drizzle";
import { permissionTable } from "@/drizzle/schemas/permission";
import { roleTable } from "@/drizzle/schemas/role";
import { roleToPermissionTable } from "@/drizzle/schemas/role-to-permission";

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

/**
 * 分配角色权限
 */
export const roleAssignPermissionHandler: AppRouteHandler<RT.RoleAssignPermissionRoute> = async (c) => {
  const { id, permissions } = await c.req.valid("json");

  if (permissions.length === 0)
    throw new Error(`The permissions length is 0,id = ${id}`);

  // 查询数据库中的真实权限
  const realPermissions = await db.query.permissionTable.findMany({
    where: inArray(permissionTable.id, permissions.map(perm => perm.id)),
  });

  // 准备要插入的数据
  const roleToPermRows = realPermissions.map(perm => ({ roleId: id, permissionId: perm.id }));

  // 保存数据
  await db.transaction(async (tx) => {
    await tx.delete(roleToPermissionTable).where(eq(roleToPermissionTable.roleId, id));

    await tx.insert(roleToPermissionTable).values(roleToPermRows);
  });

  // 返回结果
  const result = await db.query.roleTable.findFirst({
    where: eq(roleTable.id, id),
    with: {
      permissions: true,
    },
  });

  return successResponse(c, result);
};
