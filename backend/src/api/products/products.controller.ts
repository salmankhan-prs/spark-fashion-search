import type { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { getProducts } from "./products.service";

export const productsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.query.merchantId as string;
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      if (!merchantId) {
        return handleServiceResponse(
          ServiceResponse.failure("merchantId is required", null, 400),
          res
        );
      }

      const result = await getProducts({ merchantId, limit, offset });
      return handleServiceResponse(ServiceResponse.success("OK", result), res);
    } catch (error) {
      next(error);
    }
  },
};


