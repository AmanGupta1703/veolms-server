import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { sendError } from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.headers.authorization?.split("Bearer ")[1];

    if (!accessToken) {
      return sendError(res, 401, "Invalid token");
    }

    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      ) as { _id: string };

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        return sendError(res, 401, "No user found");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof Error) {
        console.log(`[ERROR]: ${error.name} - ${error.message}`);
      }
      return sendError(res, 401, "Invalid token.");
    }
  },
);

export { protect };
