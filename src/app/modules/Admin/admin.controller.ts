import { Request, Response } from "express";
import { AdminServices } from "./admin.service";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    const result = await AdminServices.getAllAdmin(req.query);
    res.status(200).json({
      success: true,
      message: "Admin are fetched successfully!",
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
};
