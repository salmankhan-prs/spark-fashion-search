import type { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { getMerchandisingRules } from "./merchandising.service";

export const merchandisingController = {
  getRules: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.query.merchantId as string;

      if (!merchantId) {
        return handleServiceResponse(
          ServiceResponse.failure("merchantId is required", null, 400),
          res
        );
      }

      const result = await getMerchandisingRules(merchantId);
      return handleServiceResponse(ServiceResponse.success("OK", result), res);
    } catch (error) {
      next(error);
    }
  },
};


