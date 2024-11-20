import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { z } from "zod";

import { permissionTable } from "./permission";
import { roleTable } from "./role";

export const roleToPermTable = pgTable("role_to_perm_table", {
  roleId: integer("role_id")
    .notNull()
    .references(() => roleTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  permId: integer("perm_id")
    .notNull()
    .references(() => permissionTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
}, t => ({
  pk: primaryKey({ columns: [t.roleId, t.permId] }),
}));

export const roleToPermRelationsTable = relations(roleToPermTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [roleToPermTable.roleId],
    references: [roleTable.id],
  }),
  permission: one(permissionTable, {
    fields: [roleToPermTable.permId],
    references: [permissionTable.id],
  }),
}));

export const roleToPermSchema = z.object({
  roleId: z.number(),
  permId: z.number(),
});
