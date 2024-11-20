import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { z } from "zod";

import { permissionTable } from "./permission";
import { roleTable } from "./role";

export const roleToPermissionTable = pgTable("role_to_perm_table", {
  roleId: integer("role_id")
    .notNull()
    .references(() => roleTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permissionTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
}, t => ({
  pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}));

export const roleToPermissionRelations = relations(roleToPermissionTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [roleToPermissionTable.roleId],
    references: [roleTable.id],
  }),
  permission: one(permissionTable, {
    fields: [roleToPermissionTable.permissionId],
    references: [permissionTable.id],
  }),
}));

export const roleToPermissionSchema = z.object({
  roleId: z.number(),
  permissionId: z.number(),
});
