import jwt, { Secret, SignOptions } from "jsonwebtoken";

function generateAccessToken(userId: string) {
  const payload: { _id: string } = { _id: userId };
  const secret = process.env.JWT_ACCESS_SECRET as Secret;
  const options = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions;

  return jwt.sign(payload, secret, options);
}

function generateRefreshToken(userId: string) {
  const payload: { _id: string } = { _id: userId };
  const secret = process.env.JWT_REFRESH_SECRET as Secret;
  const options = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions;

  return jwt.sign(payload, secret, options);
}

export { generateAccessToken, generateRefreshToken };
