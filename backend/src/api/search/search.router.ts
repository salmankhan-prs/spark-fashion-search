import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { searchController } from "./search.controller";
import { searchRequestSchema, searchResponseSchema } from "./search.schema";

export const searchRegistry = new OpenAPIRegistry();
export const searchRouter: Router = express.Router();

searchRegistry.registerPath({
  method: "post",
  path: "/api/v1/search",
  tags: ["Search"],
  summary: "Semantic product search",
  description: "AI-powered search that understands natural language queries and applies merchandising rules.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: searchRequestSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(searchResponseSchema.shape.body, "Search results"),
});

searchRouter.post("/", validateRequest(searchRequestSchema), searchController.search);
