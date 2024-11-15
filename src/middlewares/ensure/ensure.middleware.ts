import type { NextFunction, Request, Response } from "express";
import type { DynamicParamsIdFinder, PrismaClientGeneric } from "../../interfaces/utils.interface";
import prismaClient from "../../prisma";
import { AppError } from "../../Error/AppError.error";
import type { AnyZodObject } from "zod";

class EnsureMiddleware {
  public validateBody =
    (schema: AnyZodObject) =>
    (req: Request, _: Response, nextFunction: NextFunction): void => {
      req.body = schema.parse(req.body);
      return nextFunction();
    };


  public existingParams =
    ({ error, model, searchKey }: DynamicParamsIdFinder) =>
    async (request: Request, response: Response, next: NextFunction) => {
        const  id = request.params[searchKey];

        const client = prismaClient[model] as PrismaClientGeneric;

        const resource = await client.findFirst({where: { id }});

        if (!resource) {
           throw new AppError(error, 404);
        }

        response.locals = { ...response.locals, resource };
        return next();
    };


}

const ensureMiddleware  = new EnsureMiddleware();
export { ensureMiddleware };