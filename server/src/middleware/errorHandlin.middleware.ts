import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface AppError extends Error {
  statusCode: number;
  status?: string;
  message: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
