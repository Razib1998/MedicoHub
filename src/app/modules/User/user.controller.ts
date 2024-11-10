import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";

const createAdminIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserServices.createAdmin(req.body);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Admin Created Successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const userControllers = {
  createAdminIntoDB,
};
