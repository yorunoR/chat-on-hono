import { relations } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns/timestamps.js";
import { users } from "./users.js";

export const chatSessions = pgTable("chat_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 256 }).notNull(),
  uid: varchar("uid", { length: 128 }).notNull().unique(),
  initialMessage: text("initial_message"),
  ...timestamps,
});

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
}));

export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
