import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import drizzleConfig from "../drizzle.config";



async function main() {
	const dbUrl = Bun.env.DB_URL; 
	if (!dbUrl) {
		throw new Error("DB_URL environment variable is not set");
	}

	const connection = postgres(dbUrl, { max: 1 });

	await migrate(drizzle(connection), { migrationsFolder: drizzleConfig.out });

	await connection.end();
}

main()
	.then(() => {
		// biome-ignore lint/suspicious/noConsole: Migration script needs console output
		console.log("✅ Migration completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		// biome-ignore lint/suspicious/noConsole: Migration script needs console output
		console.error("❌ Migration failed:", error);
		process.exit(1);
	});
