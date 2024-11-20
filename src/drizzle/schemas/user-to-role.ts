import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { z } from "zod";

import { roleTable } from "./role";
import { userTable } from "./user";

export const userToRoleTable = pgTable("user_to_role_table", {
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  roleId: integer("role_id")
    .notNull()
    .references(() => roleTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

}, t => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

export const userToRoleRelations = relations(userToRoleTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userToRoleTable.userId],
    references: [userTable.id],
  }),
  role: one(roleTable, {
    fields: [userToRoleTable.roleId],
    references: [roleTable.id],
  }),
}));

export const userToRoleSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
});
