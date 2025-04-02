import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

export function appErrors(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);

  res
    .status(error.statusCode || 400)
    .json({ message: error.message || "Something went wrong" });
}
