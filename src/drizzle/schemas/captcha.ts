import type { z } from "zod";

import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const captchaTable = pgTable("captcha_table", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  code: text("code").notNull(),
  expiredAt: timestamp("expired_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const captchaSchema = createSelectSchema(captchaTable);
export const captchaInsertSchema = createInsertSchema(captchaTable).omit({ id: true });
export const captchaUpdateSchema = captchaInsertSchema.partial();

export type CaptchaTable = z.infer<typeof captchaSchema>;
