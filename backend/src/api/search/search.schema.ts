import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const searchFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  collections: z.array(z.string()).optional(),
});

export const searchRequestSchema = z.object({
  body: z.object({
    query: z.string().min(1).max(500),
    merchantId: z.string().uuid(),
    limit: z.number().min(1).max(100).default(20).optional(),
    filters: searchFiltersSchema.optional(),
  }),
});

export type SearchRequest = z.infer<typeof searchRequestSchema.shape.body>;

export const searchProductSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  brand: z.string(),
  price: z.string(),
  originalPrice: z.string().nullable(),
  currency: z.string(),
  stock: z.number(),
  url: z.string().nullable(),
  image: z.string().nullable(),
  collections: z.array(z.string()).nullable(),
  tags: z.array(z.string()).nullable(),
  score: z.number(),
});

export const searchBannerSchema = z.object({
  text: z.string(),
  link: z.string().optional(),
  position: z.enum(["top", "bottom"]),
});

export const searchMetaSchema = z.object({
  query: z.string(),
  totalResults: z.number(),
  latencyMs: z.number(),
  appliedRules: z.array(z.string()),
});

export const searchResponseSchema = z.object({
  body: z.object({
    success: z.boolean(),
    meta: searchMetaSchema,
    banners: z.array(searchBannerSchema),
    products: z.array(searchProductSchema),
  }),
});

export type SearchResponse = z.infer<typeof searchResponseSchema.shape.body>;
export type SearchProduct = z.infer<typeof searchProductSchema>;
export type SearchBanner = z.infer<typeof searchBannerSchema>;
