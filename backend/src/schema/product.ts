


import { decimal, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { merchants } from "./merchant";




export const productStatusEnum = pgEnum("product_status", ["ACTIVE", "INACTIVE"]);

export const products = pgTable("products", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    merchantId: uuid("merchant_id").notNull().references(() => merchants.id),
    externalId: varchar("external_id", { length: 255 }).notNull(),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    brand: varchar("brand", { length: 255 }).notNull(),
    attributes: jsonb("attributes"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 255 }).notNull(),
    stock: integer("stock").notNull(),
    status: productStatusEnum("status").notNull().default("ACTIVE"),

    url: varchar("url", { length: 512 }),

    collections:text("collections").array().default([]),
    tags:text("tags").array().default([]),
    images:text("images").array().default([]),


    embeddingId: varchar("embedding_id", { length: 255 }),

    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }).notNull().defaultNow(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});