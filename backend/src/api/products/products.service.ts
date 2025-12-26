import { db } from "@/common/utils/db";
import { products } from "@/schema";
import { eq, sql } from "drizzle-orm";
import type { ProductsQuery, ProductsListResponse } from "./products.schema";

export async function getProducts(query: ProductsQuery): Promise<ProductsListResponse> {
  const { merchantId, limit, offset } = query;

  const productsList = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      category: products.category,
      brand: products.brand,
      price: products.price,
      originalPrice: products.originalPrice,
      currency: products.currency,
      stock: products.stock,
      url: products.url,
      images: products.images,
      collections: products.collections,
      tags: products.tags,
    })
    .from(products)
    .where(eq(products.merchantId, merchantId))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.merchantId, merchantId));

  const total = countResult[0]?.count || 0;

  const transformedProducts = productsList.map((p) => ({
    ...p,
    image: p.images?.[0] || null,
  }));

  return {
    products: transformedProducts,
    pagination: { total, limit, offset },
  };
}


