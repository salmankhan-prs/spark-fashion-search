import type { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { performSearch } from "./search.service";
import type { SearchRequest } from "./search.schema";

export const searchController = {
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchRequest: SearchRequest = req.body;
      const result = await performSearch(searchRequest);
      const serviceResponse = ServiceResponse.success("Search completed", result);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      next(error);
    }
  },
};
