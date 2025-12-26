import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { merchantsResponseSchema } from "./merchants.schema";
import { merchantsController } from "./merchants.controller";

export const merchantsRegistry = new OpenAPIRegistry();
export const merchantsRouter: Router = express.Router();

merchantsRegistry.registerPath({
  method: "get",
  path: "/api/v1/merchants",
  tags: ["Merchants"],
  summary: "List all merchants",
  responses: createApiResponse(merchantsResponseSchema, "List of merchants"),
});

merchantsRouter.get("/", merchantsController.getAll);
