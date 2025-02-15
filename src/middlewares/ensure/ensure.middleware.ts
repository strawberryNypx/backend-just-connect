import type { NextFunction, Request, Response } from "express";
import type {
  DynamicParamsIdFinder,
  PrismaClientGeneric,
} from "../../interfaces/utils.interface";
import prismaClient from "../../prisma";
import { AppError } from "../../Error/AppError.error";
import type { AnyZodObject, ZodEffects } from "zod";
import { UserMessagesEnum } from "../../Error/Enums/UserMessage.enum";

class EnsureMiddleware {
  public validateBody =
    (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    (req: Request, _: Response, nextFunction: NextFunction): void => {
      req.body = schema.parse(req.body);
      return nextFunction();
    };

  public existingParams =
    ({ error, model, searchKey }: DynamicParamsIdFinder) =>
    async (request: Request, response: Response, next: NextFunction) => {
      const paramsValue = request.params[searchKey];

      const client = prismaClient[model] as PrismaClientGeneric;

      const resource = await client.findFirst({ where: { [searchKey]: paramsValue } });

      if (!resource) {
        throw new AppError({ error: [error] }, 404);
      }

      response.locals = { ...response.locals, resource };
      return next();
    };

  public uniqueEmail = async (
    request: Request,
    _: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const { email } = request.body;
    if (!email) return nextFunction();
    const foundedUserEmail = await prismaClient.user.findFirst({
      where: { email },
    });

    if (foundedUserEmail) {
      throw new AppError(
        {
          email: [UserMessagesEnum.EMAIL_ALREADY_EXISTS],
        },
        409
      );
    }

    return nextFunction();
  };
  public uniqueUsername = async (
    request: Request,
    _: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const { username } = request.body;
    if (!username) return nextFunction();
    const foundedUsername = await prismaClient.user.findFirst({
      where: { username },
    });

    if (foundedUsername) {
      throw new AppError(
        {
          username: [UserMessagesEnum.USERNAME_ALREADY_EXISTS],
        },
        409
      );
    }
    return nextFunction();
  };
}

const ensureMiddleware = new EnsureMiddleware();
export { ensureMiddleware };
