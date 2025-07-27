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

export const userControllers = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
};
