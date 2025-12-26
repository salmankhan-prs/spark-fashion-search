import { db } from "@/common/utils/db";
import { merchants } from "@/schema";
import type { MerchantsResponse } from "./merchants.schema";

export async function getAllMerchants(): Promise<MerchantsResponse> {
  const allMerchants = await db.select().from(merchants);
  return {
    merchants: allMerchants.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      email: m.email,
      status: m.status,
    })),
  };
}


