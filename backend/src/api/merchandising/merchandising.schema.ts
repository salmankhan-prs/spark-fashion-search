import { z } from "zod";

export const ruleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  conditions: z.record(z.any()),
  actions: z.record(z.any()),
  priority: z.number().nullable(),
  isActive: z.boolean(),
});

export const merchandisingQuerySchema = z.object({
  merchantId: z.string().uuid(),
});

export const merchandisingResponseSchema = z.object({
  rules: z.array(ruleSchema),
  activeCount: z.number(),
});

export type Rule = z.infer<typeof ruleSchema>;
export type MerchandisingQuery = z.infer<typeof merchandisingQuerySchema>;
export type MerchandisingResponse = z.infer<typeof merchandisingResponseSchema>;


