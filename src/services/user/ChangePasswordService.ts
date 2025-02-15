import prismaClient from "../../prisma";
import { compare, hash } from "bcryptjs";
import { ChangeUserPasswordData } from "../../interfaces/user/UserTypes";
import { AppError } from "../../Error/AppError.error";
import { FieldMessagesEnum } from "../../Error/Enums/FieldErrors.enum";

class ChangePasswordService {
  async execute(data: ChangeUserPasswordData, id: string) {
    const { password, newPassword } = data;

    const user = await prismaClient.user.findFirst({
      where: {
        id: id,
      },
    });

    const passwordCheck = await compare(password, user.password);

    if (!passwordCheck) {
      throw new AppError({ error: [FieldMessagesEnum.PASSWORD_WRONG] }, 401);
    }

    const newPasswordHash = await hash(newPassword, 10);

    const userUpdated = await prismaClient.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPasswordHash,
      },
    });

    return userUpdated;
  }
}

export { ChangePasswordService };
