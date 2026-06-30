import { CookieOptions } from "express";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
