import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validation =
  (Schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = Schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.errors[0];

      res.status(400).json({
        message: firstError.message, // Show the actual first Zod error message at the top
        errors: result.error.errors.map((e) => ({
          message: "Validation failed",
          path: e.path.join("."),
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
