import { db } from "@/common/utils/db";
import { merchandisingRules } from "@/schema";
import { eq } from "drizzle-orm";
import type { MerchandisingResponse } from "./merchandising.schema";

export async function getMerchandisingRules(merchantId: string): Promise<MerchandisingResponse> {
  const rules = await db
    .select()
    .from(merchandisingRules)
    .where(eq(merchandisingRules.merchantId, merchantId));

  const activeCount = rules.filter((r) => r.isActive).length;

  return { rules, activeCount };
}


