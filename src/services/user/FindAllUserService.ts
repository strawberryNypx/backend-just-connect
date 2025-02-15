import { ReturnUsersData } from "../../interfaces/user/UserTypes";
import prismaClient from "../../prisma";
import { ListUserSchema } from "../../schemas/userSchemas";
import { Prisma } from "@prisma/client";

class FindAllUserService {
  async execute(
    name?: string,
    page: number = 1,
    limit: number = 16
  ): Promise<{ users: ReturnUsersData; totalPages: number }> {
    const searchByNameOrUsername: Prisma.UserWhereInput | undefined = name
      ? {
          OR: [
            {
              name: {
                contains: name,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: name,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined;

    const [users, total] = await Promise.all([
      prismaClient.user.findMany({
        where: searchByNameOrUsername || {},
        skip: (page - 1) * limit,
        take: limit,
        include: {
          posts: true,
        },
      }),
      prismaClient.user.count({
        where: searchByNameOrUsername,
      }),
    ]);

    const usersWithPostCount = users.map((user) => ({
      ...user,
      postCount: user.posts.length,
    }));

    return {
      users: ListUserSchema.parse(usersWithPostCount),
      totalPages: Math.ceil(total / limit),
    };
  }
}

export { FindAllUserService };
