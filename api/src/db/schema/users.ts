import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { chatSessions } from "./chat_sessions.js";
import { timestamps } from "./columns/timestamps.js";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  uid: varchar("uid", { length: 256 }).unique(),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  chatSessions: many(chatSessions),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
