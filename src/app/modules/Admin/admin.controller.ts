import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../pick";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, [
      "email",
      "name",
      "searchTerm",
      "contactNumber",
    ]);

    const options = pick(req.query, ["page", "limit"]);
    const result = await AdminServices.getAllAdmin(filters, options);
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
