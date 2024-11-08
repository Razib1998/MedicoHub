import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.get("/", userControllers.createAdminIntoDB);

export const UserRoutes = router;
