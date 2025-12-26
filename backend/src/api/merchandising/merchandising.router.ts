import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { merchandisingResponseSchema } from "./merchandising.schema";
import { merchandisingController } from "./merchandising.controller";

export const merchandisingRegistry = new OpenAPIRegistry();
export const merchandisingRouter: Router = express.Router();

merchandisingRegistry.registerPath({
  method: "get",
  path: "/api/v1/merchandising",
  tags: ["Merchandising"],
  summary: "List merchandising rules for a merchant",
  request: {
    query: z.object({ merchantId: z.string().uuid() }),
  },
  responses: createApiResponse(merchandisingResponseSchema, "Merchandising rules"),
});

merchandisingRouter.get("/", merchandisingController.getRules);
