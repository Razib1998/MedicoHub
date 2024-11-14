import prisma from "../../Shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExists?.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid Password");
  }

  const accessToken = await jwt.sign(
    {
      email: isUserExists?.email,
      role: isUserExists?.role,
    },
    "secret",
    { algorithm: "HS256", expiresIn: "10m" }
  );

  const refreshToken = await jwt.sign(
    {
      email: isUserExists?.email,
      role: isUserExists?.role,
    },
    "secretRefresh",
    { algorithm: "HS256", expiresIn: "10d" }
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChanged: isUserExists?.needsPasswordChanged,
  };
};

export const AuthServices = {
  loginUser,
};
