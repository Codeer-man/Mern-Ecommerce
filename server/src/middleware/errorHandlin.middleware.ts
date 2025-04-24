import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface AppError extends Error {
  statusCode: number;
  success: boolean;

  message: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.success = err.success || false;

  res.status(err.statusCode).json({
    success: err.success,
    message: err.message,
  });
};
