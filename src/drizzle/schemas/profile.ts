import type { z } from "zod";

import { integer, pgTable, serial, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const profileTable = pgTable("profile_table", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  avatar: text("avatar"),
  gender: smallint("gender").default(0), // 0: unknown, 1: male, 2: female
  birthday: timestamp("birthday", { withTimezone: true }),
  signature: text("signature"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const profileSchema = createSelectSchema(profileTable);
export const profileInsertSchema = createInsertSchema(profileTable).omit({ id: true });
export const profileUpdateSchema = profileInsertSchema.partial();

export type ProfileTable = z.infer<typeof profileSchema>;
