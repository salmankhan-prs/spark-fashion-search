import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { searchRegistry } from "@/api/search/search.router";
import { merchantsRegistry } from "@/api/merchants/merchants.router";
import { productsRegistry } from "@/api/products/products.router";
import { merchandisingRegistry } from "@/api/merchandising/merchandising.router";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    searchRegistry,
    merchantsRegistry,
    productsRegistry,
    merchandisingRegistry,
  ]);
  
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Spark Search API",
      description: "AI-powered e-commerce search API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
