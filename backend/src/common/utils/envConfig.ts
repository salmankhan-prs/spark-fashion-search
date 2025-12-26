import { z } from "zod";

const numericString = (defaultVal: number) =>
  z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return defaultVal;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? defaultVal : parsed;
    })
    .pipe(z.number().int().positive());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HOST: z.string().default("localhost"),
  PORT: numericString(8080),

  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173")
    .transform((val) => val.split(",").map((v) => v.trim())),

  DB_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  QDRANT_URL: z.string().url().default("http://localhost:6333"),
  QDRANT_API_KEY: z.string().min(1),

  COMMON_RATE_LIMIT_MAX_REQUESTS: numericString(200),
  COMMON_RATE_LIMIT_WINDOW_MS: numericString(900000),
});

const parsedEnv = envSchema.safeParse(process.env);

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
