import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../Shared/prisma";

const createAdmin = async (payload: any, file: any) => {
  const hashPassword = await bcrypt.hash(payload?.password, 12);

  const userData = {
    email: payload?.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  // if (file) {
  //   const path = file?.path;
  //   userData.profilePhoto = path;
  // }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    payload.admin.profilePhoto = file?.path;
    const createAdmin = await transactionClient.admin.create({
      data: payload?.admin,
    });

    return createAdmin;
  });

  return result;
};

export const UserServices = {
  createAdmin,
};
