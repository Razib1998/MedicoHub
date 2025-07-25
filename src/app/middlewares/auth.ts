import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../Shared/jwtTokenGenerator";
import config from "../config";
import ApiError from "../Errors/ApiError";
import { HttpStatus } from "http-status-ts";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "You Are not authorized");
      }
      const verifiedUser = verifyToken(
        token,
        config.jwt.jwt_access_secret as string
      );

      req.user = verifiedUser;
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          HttpStatus.FORBIDDEN,
          "You are forbidden access this"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
