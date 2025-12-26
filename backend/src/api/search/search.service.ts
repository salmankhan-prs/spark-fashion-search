import { eq, inArray } from "drizzle-orm";
import { db } from "@/common/utils/db";
import { generateEmbedding } from "@/embedding";
import { searchProducts } from "@/qdrant";
import { products, merchandisingRules } from "@/schema";
import type { SearchRequest, SearchResponse, SearchProduct, SearchBanner } from "./search.schema";

interface ScoredProduct {
  id: string;
  score: number;
  payload: {
    merchant_id: string;
    category?: string;
    brand?: string;
    price: number;
    in_stock: boolean;
    collections: string[];
    title: string;
    image?: string;
    url?: string;
  };
}

interface MerchandisingRule {
  id: string;
  name: string;
  type: "BOOST" | "BURY" | "PIN" | "FILTER" | "BANNER" | "REDIRECT";
  conditions: Record<string, any>;
  actions: Record<string, any>;
  priority: number | null;
}

export async function performSearch(request: SearchRequest): Promise<SearchResponse> {
  const startTime = Date.now();
  const appliedRules: string[] = [];
  const banners: SearchBanner[] = [];

  const queryEmbedding = await generateEmbedding(request.query);

  const qdrantResults = await searchProducts(queryEmbedding, {
    merchantId: request.merchantId,
    limit: (request.limit || 20) * 2,
    filters: {
      category: request.filters?.category,
      minPrice: request.filters?.minPrice,
      maxPrice: request.filters?.maxPrice,
      inStock: request.filters?.inStock,
    },
  });

  if (!qdrantResults) {
    return {
      success: false,
      meta: { query: request.query, totalResults: 0, latencyMs: 0, appliedRules: [] },
      banners: [],
      products: [],
    };
  }

  let scoredProducts: ScoredProduct[] = qdrantResults.map((result) => ({
    id: result.id as string,
    score: result.score,
    payload: result.payload as ScoredProduct["payload"],
  }));

  const rules = await db
    .select()
    .from(merchandisingRules)
    .where(eq(merchandisingRules.merchantId, request.merchantId));

  const activeRules = rules
    .filter((r) => r.isActive)
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100)) as MerchandisingRule[];

  for (const rule of activeRules) {
    const result = applyRule(rule, scoredProducts, request.query);
    scoredProducts = result.products;
    if (result.applied) appliedRules.push(rule.name);
    if (result.banner) banners.push(result.banner);
  }

  scoredProducts.sort((a, b) => b.score - a.score);
  scoredProducts = scoredProducts.slice(0, request.limit || 20);

  const productIds = scoredProducts.map((p) => p.id);
  const fullProducts = productIds.length > 0
    ? await db.select().from(products).where(inArray(products.id, productIds))
    : [];

  const productMap = new Map(fullProducts.map((p) => [p.id, p]));

  const responseProducts: SearchProduct[] = scoredProducts
    .map((sp) => {
      const fullProduct = productMap.get(sp.id);
      if (!fullProduct) return null;
      return {
        id: fullProduct.id,
        title: fullProduct.title,
        description: fullProduct.description,
        category: fullProduct.category,
        brand: fullProduct.brand,
        price: fullProduct.price,
        originalPrice: fullProduct.originalPrice,
        currency: fullProduct.currency,
        stock: fullProduct.stock,
        url: fullProduct.url,
        image: fullProduct.images?.[0] ?? null,
        collections: fullProduct.collections,
        tags: fullProduct.tags,
        score: sp.score,
      };
    })
    .filter((p): p is SearchProduct => p !== null);

  return {
    success: true,
    meta: {
      query: request.query,
      totalResults: responseProducts.length,
      latencyMs: Date.now() - startTime,
      appliedRules,
    },
    banners,
    products: responseProducts,
  };
}

interface RuleResult {
  products: ScoredProduct[];
  applied: boolean;
  banner?: SearchBanner;
}

function applyRule(rule: MerchandisingRule, products: ScoredProduct[], query: string): RuleResult {
  switch (rule.type) {
    case "BOOST": return applyBoostRule(rule, products);
    case "BURY": return applyBuryRule(rule, products);
    case "FILTER": return applyFilterRule(rule, products);
    case "PIN": return applyPinRule(rule, products);
    case "BANNER": return applyBannerRule(rule, products, query);
    default: return { products, applied: false };
  }
}

function applyBoostRule(rule: MerchandisingRule, products: ScoredProduct[]): RuleResult {
  let applied = false;
  const boostFactor = rule.actions.boostFactor ?? 1.5;
  const boostedProducts = products.map((product) => {
    if (productMatchesConditions(product, rule.conditions)) {
      applied = true;
      return { ...product, score: product.score * boostFactor };
    }
    return product;
  });
  return { products: boostedProducts, applied };
}

function applyBuryRule(rule: MerchandisingRule, products: ScoredProduct[]): RuleResult {
  let applied = false;
  const buryFactor = rule.actions.boostFactor ?? 0.5;
  const buriedProducts = products.map((product) => {
    if (productMatchesConditions(product, rule.conditions)) {
      applied = true;
      return { ...product, score: product.score * buryFactor };
    }
    return product;
  });
  return { products: buriedProducts, applied };
}

function applyFilterRule(rule: MerchandisingRule, products: ScoredProduct[]): RuleResult {
  const filteredProducts = products.filter((product) => !productMatchesConditions(product, rule.conditions));
  return { products: filteredProducts, applied: filteredProducts.length < products.length };
}

function applyPinRule(rule: MerchandisingRule, products: ScoredProduct[]): RuleResult {
  const pinnedProductId = rule.conditions.productId;
  const position = (rule.actions.position ?? 1) - 1;
  const pinnedIndex = products.findIndex((p) => p.id === pinnedProductId);
  if (pinnedIndex === -1) return { products, applied: false };
  
  const pinnedProduct = products[pinnedIndex];
  const otherProducts = products.filter((_, i) => i !== pinnedIndex);
  otherProducts.splice(position, 0, pinnedProduct);
  return { products: otherProducts, applied: true };
}

function applyBannerRule(rule: MerchandisingRule, products: ScoredProduct[], query: string): RuleResult {
  const queryWords = rule.conditions.queryContains as string[] | undefined;
  if (!queryWords || queryWords.length === 0) return { products, applied: false };

  const queryLower = query.toLowerCase();
  const matches = queryWords.some((word) => queryLower.includes(word.toLowerCase()));

  if (matches && rule.actions.banner) {
    return {
      products,
      applied: true,
      banner: {
        text: rule.actions.banner.text,
        link: rule.actions.banner.link,
        position: rule.actions.banner.position ?? "top",
      },
    };
  }
  return { products, applied: false };
}

function productMatchesConditions(product: ScoredProduct, conditions: Record<string, any>): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    if (!matchCondition(product, key, value)) return false;
  }
  return true;
}

function matchCondition(product: ScoredProduct, key: string, value: any): boolean {
  switch (key) {
    case "collection":
      return product.payload.collections?.includes(value) ?? false;
    case "category":
      return product.payload.category === value;
    case "brand":
      return product.payload.brand === value;
    case "stock":
      if (typeof value === "object") {
        if (value.eq === 0) return !product.payload.in_stock;
        if (value.lt !== undefined) return !product.payload.in_stock;
        if (value.gt !== undefined) return product.payload.in_stock;
      }
      return false;
    case "price":
      if (typeof value === "object") {
        const price = product.payload.price;
        if (value.lt !== undefined && price >= value.lt) return false;
        if (value.gt !== undefined && price <= value.gt) return false;
        if (value.lte !== undefined && price > value.lte) return false;
        if (value.gte !== undefined && price < value.gte) return false;
        return true;
      }
      return product.payload.price === value;
    case "in_stock":
      return product.payload.in_stock === value;
    default:
      return false;
  }
}
