import { jsonb, pgEnum, pgTable ,timestamp,uuid, varchar} from "drizzle-orm/pg-core";

//export const projectStatusEnum = pgEnum("project_status", ["ACTIVE", "COMPLETED", "ON_HOLD"]);


//	status: projectStatusEnum("status").notNull().default("ACTIVE"),



export const platformTypeEnum = pgEnum("platform_type", ["Shopify", "Magento", "WooCommerce", "Prestashop", "OpenCart", "Custom"]);

export const planTypeEnum = pgEnum("plan_type", ["Basic", "Premium","Free"]);

export const merchantStatusEnum = pgEnum("merchant_status", ["ACTIVE", "INACTIVE"]);
export const merchants =pgTable("merchants", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	name:varchar("name",{ length: 255 }).notNull(),
    slug:varchar("slug",{ length: 255 }).notNull().unique(),
    email:varchar("email",{ length: 255 }).notNull().unique(),
    platform:platformTypeEnum("platform").notNull(),
    platformConfig :jsonb("platform_config"),
    settings: jsonb("settings"),
    plan:planTypeEnum("plan").notNull(),
    status :merchantStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at",{withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at",{withTimezone: true}).notNull().defaultNow(),

});

//TODO: need to add index