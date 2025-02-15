import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../Error/AppError.error";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

class HandleErrors {
  public static execute = (
    error: unknown,
    _: Request,
    response: Response,
    __: NextFunction
  ) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.errors || { general: [error.message] },
      });
    }

    if (error instanceof ZodError) {
      return response
        .status(400)
        .json({ message: error.flatten().fieldErrors });
    }

    if (error instanceof JsonWebTokenError) {
      return response.status(400).json({ message: error.message });
    }

    return response
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  };
}

export { HandleErrors };
