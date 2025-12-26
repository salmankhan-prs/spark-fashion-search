import OpenAI from "openai";
import { env } from "@/common/utils/envConfig";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

interface ProductData {
  title: string;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  tags?: string[];
}

export function createProductEmbeddingText(product: ProductData): string {
  const parts: string[] = [product.title];
  if (product.description) parts.push(product.description);
  if (product.category) parts.push(`Category: ${product.category}`);
  if (product.brand) parts.push(`Brand: ${product.brand}`);
  if (product.tags?.length) parts.push(`Tags: ${product.tags.join(", ")}`);
  return parts.join("\n");
}
