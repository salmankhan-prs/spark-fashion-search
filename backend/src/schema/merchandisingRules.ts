import { boolean, date, decimal, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { merchants } from "./merchant";


export const ruleTypeEnum = pgEnum("rule_type", [
  "BOOST",
  "BURY",
  "PIN",
  "FILTER",
  "BANNER",
  "REDIRECT",
]);

export const merchandisingRules = pgTable(
  "merchandising_rules",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    merchantId: uuid("merchant_id")
      .notNull()
      .references(() => merchants.id, { onDelete: "cascade" }),

    // Rule info
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    // Rule type
    type: ruleTypeEnum("type").notNull(),

    // Conditions and actions (flexible JSON)
    conditions: jsonb("conditions").notNull().default({}),
    actions: jsonb("actions").notNull().default({}),

    // Priority
    priority: integer("priority").default(100),

    // Status
    isActive: boolean("is_active").default(true),

    // Scheduling
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    merchantIdx: index("idx_rules_merchant").on(table.merchantId),
    merchantActiveIdx: index("idx_rules_merchant_active").on(
      table.merchantId,
      table.isActive
    ),
  })
);