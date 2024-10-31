import { AppError } from "../../Error/AppError.error";
import { ReturnProfileUserData, ReturnUserData } from "../../interfaces/user/UserTypes";
import prismaClient from "../../prisma";
import { postOnUserSchema, postSchema } from "../../schemas/postSchemas";
import { userProfileReturnSchema, userReturnSchema } from "../../schemas/userSchemas";

class GetUserProfileService {
  async execute(id: string): Promise<ReturnProfileUserData> {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      },
      include: { posts: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return userProfileReturnSchema.parse(user);
  }
}

export { GetUserProfileService };
