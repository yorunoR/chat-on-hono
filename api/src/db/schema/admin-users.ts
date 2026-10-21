import {
  boolean,
  integer,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./columns/timestamps.js";

export const adminUsers = pgTable(
  "admin_users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    email: varchar("email", { length: 255 }).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isSuperuser: boolean("is_superuser").notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("ix_admin_users_email").on(table.email)],
);

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
