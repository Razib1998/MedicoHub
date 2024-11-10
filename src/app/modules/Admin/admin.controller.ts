import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../Shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";

const getAllAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, adminFilterableFields);

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await AdminServices.getAllAdmin(filters, options);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Admin are fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    next(err);
  }
};

const getSingleAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.getSingleAdmin(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Single Admin is fetched successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const updateAdminIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await AdminServices.updateAdmin(id, updatedData);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Admin are Updated successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const deletedAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await AdminServices.deleteAdmin(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Admin is deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const adminSoftDeleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await AdminServices.softDeleteAdmin(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Admin is deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminControllers = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deletedAdminFromDB,
  adminSoftDeleteFromDB,
};
