import { Request, Response, NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler";
import { sendError } from "../utils/apiResponse";

const authorize = function (...roles: string[]) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user) {
        return sendError(res, 401, "Authentication required");
      }

      if (!roles.includes(user.role)) {
        return sendError(
          res,
          403,
          "Forbidden: You do not have the required permissions.",
        );
      }

      next();
    },
  );
};

export { authorize };
