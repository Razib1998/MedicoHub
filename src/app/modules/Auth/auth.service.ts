import { tokenGenerator } from "../../Shared/jwtTokenGenerator";
import prisma from "../../Shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

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

  const accessToken = tokenGenerator(
    {
      email: isUserExists?.email,
      role: isUserExists?.role,
    },
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expiration as string
  );

  const refreshToken = tokenGenerator(
    {
      email: isUserExists?.email,
      role: isUserExists?.role,
    },
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expiration as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChanged: isUserExists?.needsPasswordChanged,
  };
};

const accessTokenGenerate = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwt.verify(token, "secretRefresh") as JwtPayload;
  } catch (err) {
    throw new Error("you are not authorized..!");
  }
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
    },
  });
  const accessToken = tokenGenerator(
    {
      email: isUserExists?.email,
      role: isUserExists?.role,
    },
    "secret",
    "20m"
  );

  return {
    isUserExists,
    accessToken,
    needsPasswordChanged: isUserExists?.needsPasswordChanged,
  };
};

export const AuthServices = {
  loginUser,
  accessTokenGenerate,
};
