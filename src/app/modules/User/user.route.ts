import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";

import auth from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";
import { userValidation } from "./userValidation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.getAllUserFromDB
);

router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN"),
  multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdminIntoDB(req, res, next);
  }
);
router.post(
  "/create-doctor",
  auth("ADMIN", "SUPER_ADMIN"),
  multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userControllers.createDoctorIntoDB(req, res, next);
  }
);
router.post(
  "/create-patient",
  multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userControllers.createPatientIntoDB(req, res, next);
  }
);

router.patch("/:id/status", userControllers.UpdateUserStatus);

export const UserRoutes = router;
