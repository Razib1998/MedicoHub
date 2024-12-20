import { Request, Response } from "express";
import catchAsync from "../../Shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Logged in Successfully!",
    data: {
      accessToken: result.accessToken,
      needsPasswordChanged: result.needsPasswordChanged,
    },
  });
});

export const AuthControllers = {
  login,
};
