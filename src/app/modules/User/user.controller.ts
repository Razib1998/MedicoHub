import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdminIntoDB = async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req.body);
  res.send(result);
};

export const userControllers = {
  createAdminIntoDB,
};
