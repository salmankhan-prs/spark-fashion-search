import { z } from "zod";

export const merchantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  email: z.string(),
  status: z.string(),
});

export const merchantsResponseSchema = z.object({
  merchants: z.array(merchantSchema),
});

export type Merchant = z.infer<typeof merchantSchema>;
export type MerchantsResponse = z.infer<typeof merchantsResponseSchema>;


