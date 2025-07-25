import express from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthControllers.login);
router.post("/refreshToken", AuthControllers.accessTokenGenerator);
router.post(
  "/changePassword",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthControllers.changePassword
);
router.post("/forgetPassword", AuthControllers.forgetPassword);
router.post("/resetPassword", AuthControllers.resetPassword);

export const AuthRoutes = router;
