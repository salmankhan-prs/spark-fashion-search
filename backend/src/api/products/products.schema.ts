import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
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
});

export const productsListResponseSchema = z.object({
  products: z.array(productSchema),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
});

export const productsQuerySchema = z.object({
  merchantId: z.string(),
  limit: z.coerce.number().optional().default(50),
  offset: z.coerce.number().optional().default(0),
  category: z.string().optional(),
  brand: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductsListResponse = z.infer<typeof productsListResponseSchema>;
export type ProductsQuery = z.infer<typeof productsQuerySchema>;


