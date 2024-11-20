import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { roleToPermTable } from "./role-to-perm";

export const permissionTable = pgTable("permission_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const permissionRelations = relations(permissionTable, ({ many }) => ({
  roles: many(roleToPermTable),
}));

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type PermissionTable = typeof permissionTable;
