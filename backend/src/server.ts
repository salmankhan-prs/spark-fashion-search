import cors, { type CorsOptions } from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/common/utils/logger";
import { searchRouter } from "./api/search/search.router";
import { merchantsRouter } from "./api/merchants/merchants.router";
import { productsRouter } from "./api/products/products.router";
import { merchandisingRouter } from "./api/merchandising/merchandising.router";

const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (env.isDevelopment && origin.startsWith("http://localhost")) {
      return callback(null, true);
    }
    if (env.CORS_ORIGIN.includes(origin)) {
      return callback(null, true);
    }
    logger.error(`Origin ${origin} is not allowed by CORS`);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(rateLimiter);
app.use(requestLogger);

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/merchants", merchantsRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/merchandising", merchandisingRouter);

app.use("/api-docs", openAPIRouter);
app.use(errorHandler());

export { app, logger };
