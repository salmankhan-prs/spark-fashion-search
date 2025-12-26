import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().int().positive().default(8080),
  
  CORS_ORIGIN: z
    .string()
    .transform((val) => val.split(",").map((v) => v.trim()))
    .default("http://localhost:5173"),
  
  DB_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  QDRANT_URL: z.string().url().default("http://localhost:6333"),
  QDRANT_API_KEY: z.string().min(1),
  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(200),
  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
});

const parsedEnv = envSchema.safeParse(Bun.env);

if (!parsedEnv.success) {
  console.error("Missing environment variables:", parsedEnv.error.format());
  throw new Error("Missing environment variables");
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
};
