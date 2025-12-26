import type { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { getAllMerchants } from "./merchants.service";

export const merchantsController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllMerchants();
      return handleServiceResponse(ServiceResponse.success("OK", result), res);
    } catch (error) {
      next(error);
    }
  },
};


