import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";
import pick from "../../Shared/pick";
import { userFilterableFields } from "./user.constant";
import catchAsync from "../../Shared/catchAsync";
import { TUser } from "../../utils/interface";

const createAdminIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserServices.createAdmin(req.body, req.file);
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
const createDoctorIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserServices.createDoctor(req.body, req.file);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Doctor Created Successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const createPatientIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserServices.createPatient(req.body, req.file);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Patient Created Successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllUserFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Users are fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});
const UpdateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserStatus(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User status updated successfully!",
    data: result,
  });
});
const getMyProfile = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user;
    const result = await UserServices.getMe(user as TUser);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "My Profile fetch successfully!",
      data: result,
    });
  }
);
const updateProfileInfo = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user;
    const result = await UserServices.updateProfileInfo(user as TUser, req);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Profile Info Updated successfully!",
      data: result,
    });
  }
);

export const userControllers = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUserFromDB,
  UpdateUserStatus,
  getMyProfile,
  updateProfileInfo,
};
