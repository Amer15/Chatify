import { NextFunction, Request, Response } from "express";
import { CustomError } from "@/utils/custom_error";
import { ZodError } from "zod";
import { zodErrorMessage } from "@/utils/zod";

export function errorHandler(
  error: unknown,
  _: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  if (error instanceof ZodError) {
    res.status(400).json({ message: zodErrorMessage(error) });
    return;
  }
  if (error instanceof SyntaxError) {
    res.status(400).json({ message: error.message });
    return;
  }
  if (error instanceof Error) {
    if (error.message === "jwt malformed") {
      res
        .status(401)
        .json({ message: `access denied, invalid token provided` });
      return;
    }
    if (error.message === "jwt expired") {
      res.status(401).json({
        message: `access denied, your token expired please sign in again`,
      });
      return;
    }
    res.status(500).json({ message: error.message });
    return;
  }
  res.status(500).json({ message: "something went wrong" });
  next(error);
}
