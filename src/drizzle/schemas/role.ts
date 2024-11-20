import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { permissionSchema } from "./permission";
import { roleToPermissionTable } from "./role-to-permission";
import { userToRoleTable } from "./user-to-role";

export const roleTable = pgTable("role_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const roleRelations = relations(roleTable, ({ many }) => ({
  permissions: many(roleToPermissionTable),
  users: many(userToRoleTable),
}));

export const roleSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
  permissions: z.array(permissionSchema).default([]),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type RoleTable = typeof roleTable;
