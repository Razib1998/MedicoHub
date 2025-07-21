import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import { verifyToken } from "../../Shared/jwtTokenGenerator";
import config from "../../config";

const router = express.Router();

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("You Are not authorized");
      }
      const verifiedUser = verifyToken(
        token,
        config.jwt.jwt_access_secret as string
      );

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not authorized to access this");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN"),
  userControllers.createAdminIntoDB
);

export const UserRoutes = router;
