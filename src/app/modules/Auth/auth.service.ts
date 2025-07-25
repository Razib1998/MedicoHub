import { tokenGenerator, verifyToken } from "../../Shared/jwtTokenGenerator";
import prisma from "../../Shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import { UserStatus } from "@prisma/client";
import emailSender from "../../utils/emailSender";
import ApiError from "../../Errors/ApiError";
import { HttpStatus } from "http-status-ts";

const loginUser = async (payload: { email: string; password: string }) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
    },
  });

  const isPasswordMatched: boolean = await bcrypt.compare(
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
    decodedData = jwt.verify(
      token,
      config.jwt.jwt_refresh_secret as string
    ) as JwtPayload;
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
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expiration as string
  );

  return {
    isUserExists,
    accessToken,
    needsPasswordChanged: isUserExists?.needsPasswordChanged,
  };
};
const changePassword = async (userData: any, payload: any) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    isUserExists?.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password did not matched");
  }
  const hashPassword = await bcrypt.hash(payload?.newPassword, 12);
  await prisma.user.update({
    where: {
      email: isUserExists.email,
    },
    data: {
      password: hashPassword,
      needsPasswordChanged: false,
    },
  });
  return {
    message: "Password Change Successfully",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = tokenGenerator(
    {
      email: isUserExists?.email,
      role: isUserExists?.role,
    },
    config.reset_pass.reset_pass_token as string,
    config.reset_pass.reset_pass_expire_in as string
  );
  const resetPasswordLink =
    config.reset_pass.reset_pass_link +
    `?userId=${isUserExists?.id}&token=${resetPasswordToken}`;

  await emailSender(
    isUserExists?.email,
    ` <div>
            <p>Dear User,</p>
            <p>Your password reset link is:
                <p>${resetPasswordLink}</p>
            </p>

        </div>`
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.reset_pass.reset_pass_token as string
  );
  if (!isValidToken) {
    throw new ApiError(HttpStatus.FORBIDDEN, "Forbidden!");
  }
  const hashPassword = await bcrypt.hash(payload?.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashPassword,
    },
  });
};

export const AuthServices = {
  loginUser,
  accessTokenGenerate,
  changePassword,
  forgetPassword,
  resetPassword,
};
