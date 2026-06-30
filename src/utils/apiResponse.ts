import { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data: object = {},
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
