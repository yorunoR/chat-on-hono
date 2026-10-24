import { integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns/timestamps.js";

export const promptTemplates = pgTable("prompt_templates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  flowName: varchar("flow_name", { length: 128 }).notNull(),
  nodeName: varchar("node_name", { length: 128 }).notNull(),
  agentName: varchar("agent_name", { length: 128 }),
  template: jsonb(),
  hexdigest: varchar("hexdigest", { length: 128 }),
  ...timestamps,
});

export type PromptTemplate = typeof promptTemplates.$inferSelect;
export type NewPromptTemplate = typeof promptTemplates.$inferInsert;
