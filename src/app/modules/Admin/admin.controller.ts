import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../Shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";
import catchAsync from "../../Shared/catchAsync";

const getAllAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
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
});

const getSingleAdminFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await AdminServices.getSingleAdmin(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Single Admin is fetched successfully!",
      data: result,
    });
  }
);
const updateAdminIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await AdminServices.updateAdmin(id, updatedData);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin data is Updated successfully!",
    data: result,
  });
});

const deletedAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.deleteAdmin(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin is deleted successfully!",
    data: result,
  });
});
const adminSoftDeleteFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.softDeleteAdmin(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin is deleted successfully!",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deletedAdminFromDB,
  adminSoftDeleteFromDB,
};
