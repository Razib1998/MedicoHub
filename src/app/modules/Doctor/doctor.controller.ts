import { RequestHandler } from "express";
import catchAsync from "../../Shared/catchAsync";
import pick from "../../Shared/pick";
import { doctorFilterableFields } from "./doctor.constant";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";
import { DoctorServices } from "./doctor.service";

const getAllDoctorFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterableFields);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await DoctorServices.getAllDoctor(filters, options);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Doctor are fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});
const getSingleDoctorFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.getSingleDoctor(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Doctor is fetched successfully!",
    data: result,
  });
});

const deletedDoctorFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await DoctorServices.deleteDoctor(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Doctor is deleted successfully!",
    data: result,
  });
});
// const doctorSoftDeleteFromDB: RequestHandler = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await DoctorServices.softDeleteDoctor(id);
//   sendResponse(res, {
//     statusCode: HttpStatus.OK,
//     success: true,
//     message: "Doctor is deleted successfully!",
//     data: result,
//   });
// });

const updateDoctorData: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.updatedDoctorData(id, req.body);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Doctor data updated successfully!",
    data: result,
  });
});

export const DoctorControllers = {
  getAllDoctorFromDB,
  getSingleDoctorFromDB,
  deletedDoctorFromDB,
  updateDoctorData,
};
