import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";

import auth from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";
import { userValidation } from "./userValidation";

const router = express.Router();

router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN"),
  multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdminIntoDB(req, res, next);
  }
);

export const UserRoutes = router;
