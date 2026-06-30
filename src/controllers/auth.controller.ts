import { Request, Response, NextFunction, CookieOptions } from "express";

import User from "../models/User";

import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendError(res, 409, "User already exists.");
    }

    const newUser = await User.create({ name, email, password });

    if (!newUser) {
      return sendError(
        res,
        500,
        "Unable to create user. Please try again later.",
      );
    }

    const safeUser = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      isVerified: newUser.isVerified,
    };

    const accessToken = generateAccessToken(safeUser._id.toString());
    const refreshToken = generateRefreshToken(safeUser._id.toString());

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, options);

    return sendSuccess(res, 201, "User created successfully", {
      user: safeUser,
      accessToken,
    });
  },
);

export { register };
