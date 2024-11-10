import e, { NextFunction, Request, Response } from "express";
import { HttpStatus } from "http-status-ts";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
    },
  });
};

export default notFound;
