import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "@/common/utils/envConfig";

const qdrantUrl = env.QDRANT_URL
const qdrantApiKey = env.QDRANT_API_KEY || "";
export const qdrant = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
});

export const PRODUCT_COLLECTION = "products";
export const vectorSize = 1536;

export async function createProductCollection() {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some((c) => c.name === PRODUCT_COLLECTION);

  if (!exists) {
    await qdrant.createCollection(PRODUCT_COLLECTION, {
      vectors: { size: vectorSize, distance: "Cosine" },
    });
  }

  await createPayloadIndices();
}

async function createPayloadIndices() {
  const indices = [
    { field: "merchant_id", schema: "keyword" as const },
    { field: "category", schema: "keyword" as const },
    { field: "brand", schema: "keyword" as const },
    { field: "price", schema: "float" as const },
    { field: "in_stock", schema: "bool" as const },
    { field: "collections", schema: "keyword" as const },
  ];

  for (const { field, schema } of indices) {
    try {
      await qdrant.createPayloadIndex(PRODUCT_COLLECTION, {
        field_name: field,
        field_schema: schema,
        wait: true,
      });
    } catch (error: any) {
      if (!error.message?.includes("already exists")) {
        console.warn(`Could not create index for ${field}:`, error.message);
      }
    }
  }
}

interface ProductPayload {
  merchant_id: string;
  category?: string;
  brand?: string;
  price: number;
  in_stock: boolean;
  collections: string[];
  title: string;
  image?: string;
  url?: string;
}

export async function upsertProductVector(productId: string, vector: number[], payload: ProductPayload) {
  await qdrant.upsert(PRODUCT_COLLECTION, {
    wait: true,
    points: [{ id: productId, vector, payload }],
  });
}

interface SearchOptions {
  merchantId: string;
  limit?: number;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    collections?: string[];
  };
}

export async function searchProducts(queryVector: number[], options: SearchOptions) {
  const mustConditions: any[] = [{ key: "merchant_id", match: { value: options.merchantId } }];

  if (options.filters?.category) {
    mustConditions.push({ key: "category", match: { value: options.filters.category } });
  }
  if (options.filters?.inStock !== undefined) {
    mustConditions.push({ key: "in_stock", match: { value: options.filters.inStock } });
  }
  if (options.filters?.minPrice !== undefined) {
    mustConditions.push({ key: "price", range: { gte: options.filters.minPrice } });
  }
  if (options.filters?.maxPrice !== undefined) {
    mustConditions.push({ key: "price", range: { lte: options.filters.maxPrice } });
  }

  return qdrant.search(PRODUCT_COLLECTION, {
    vector: queryVector,
    limit: options.limit || 20,
    filter: { must: mustConditions },
    with_payload: true,
  });
}

export async function deleteProductVector(productId: string) {
  await qdrant.delete(PRODUCT_COLLECTION, { wait: true, points: [productId] });
}
