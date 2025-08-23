import { RequestHandler } from "express";
import pick from "../../Shared/pick";
import { patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.service";
import catchAsync from "../../Shared/catchAsync";
import sendResponse from "../../Shared/sendResponse";
import { HttpStatus } from "http-status-ts";

const getAllPatientFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterableFields);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await PatientServices.getAllPatient(filters, options);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Patient are fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});
const getSinglePatientFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientServices.getSinglePatient(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Patient is fetched successfully!",
    data: result,
  });
});

const updatePatientData: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientServices.updatePatientData(id, req.body);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "patient data updated successfully!",
    data: result,
  });
});

export const PatientControllers = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updatePatientData,
};
