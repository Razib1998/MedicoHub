import { NextFunction, Request, Response } from "express";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";
import { SpecialtiesServices } from "./specialties.sercvice";

const createSpecialtiesIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await SpecialtiesServices.createSpecialtiesIntoDb(req);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Specialties Created Successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const getAllSpecialtiesFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await SpecialtiesServices.getAllSpecialties();
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Specialties Data are fetched Successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const deleteSpecialtiesFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await SpecialtiesServices.deleteSpecialtiesFromDB(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Specialties is deleted Successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const SpecialtiesControllers = {
  createSpecialtiesIntoDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};
