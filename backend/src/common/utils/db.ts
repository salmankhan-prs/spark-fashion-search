import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "./logger";

// Use Bun.env for better performance
const connectionString = Bun.env.DB_URL;

if (!connectionString) {
	logger.error("DB_URL is not defined in environment variables");
	throw new Error("DB_URL is not defined in environment variables");
}

// Create a postgres connection
const client = postgres(connectionString);

// Create and export the drizzle instance
export const db = drizzle(client);

// Export the client for raw queries if needed
export const pgClient = client;
