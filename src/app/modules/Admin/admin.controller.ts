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

export const AdminControllers = {
  getAllAdminFromDB,
};
