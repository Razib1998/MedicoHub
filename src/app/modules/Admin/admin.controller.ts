import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../Shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await AdminServices.getAllAdmin(filters, options);
    res.status(200).json({
      success: true,
      message: "Admin are fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || "Failed to fetched admin data!",
      error: err,
    });
  }
};

const getSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.getSingleAdmin(id);
    res.status(200).json({
      success: true,
      message: "Single Admin is fetched successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || "Failed to fetched admin data!",
      error: err,
    });
  }
};
const updateAdminIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await AdminServices.updateAdmin(id, updatedData);
    res.status(200).json({
      success: true,
      message: "Admin data is updated successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || "Failed to fetched admin data!",
      error: err,
    });
  }
};
const deletedAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await AdminServices.deleteAdmin(id);
    res.status(200).json({
      success: true,
      message: "Admin data is deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || "Failed to fetched admin data!",
      error: err,
    });
  }
};
const adminSoftDeleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await AdminServices.softDeleteAdmin(id);
    res.status(200).json({
      success: true,
      message: "Admin is soft  deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || "Failed to fetched admin data!",
      error: err,
    });
  }
};

export const AdminControllers = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deletedAdminFromDB,
  adminSoftDeleteFromDB,
};
