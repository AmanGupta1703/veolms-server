import { Request, Response, NextFunction, CookieOptions } from "express";

import User from "../models/User";

import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { sanitizeUser } from "../utils/sanitizeUser";
import { refreshTokenCookieOptions } from "../utils/cookieOptions";

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

    const safeUser = sanitizeUser(newUser);

    const accessToken = generateAccessToken(safeUser._id.toString());
    const refreshToken = generateRefreshToken(safeUser._id.toString());

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return sendSuccess(res, 201, "User created successfully", {
      user: safeUser,
      accessToken,
    });
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "All fields are required");
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return sendError(res, 401, "Invalid credentials");
    }

    const isPasswordCorrect = await existingUser.comparePassword(password);

    if (!isPasswordCorrect) {
      return sendError(res, 401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(existingUser._id.toString());
    const refreshToken = generateRefreshToken(existingUser._id.toString());

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    const safeUser = sanitizeUser(existingUser);

    return sendSuccess(res, 200, "User login successful", {
      user: safeUser,
      accessToken,
    });
  },
);

export { register, login };
