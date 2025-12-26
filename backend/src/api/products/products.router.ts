import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { productsListResponseSchema } from "./products.schema";
import { productsController } from "./products.controller";

export const productsRegistry = new OpenAPIRegistry();
export const productsRouter: Router = express.Router();

productsRegistry.registerPath({
  method: "get",
  path: "/api/v1/products",
  tags: ["Products"],
  summary: "List products for a merchant",
  request: {
    query: z.object({
      merchantId: z.string(),
      limit: z.coerce.number().optional().default(50),
      offset: z.coerce.number().optional().default(0),
    }),
  },
  responses: createApiResponse(productsListResponseSchema, "Products list"),
});

productsRouter.get("/", productsController.getAll);
