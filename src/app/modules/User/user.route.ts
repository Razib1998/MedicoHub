import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/create-admin", userControllers.createAdminIntoDB);

export const UserRoutes = router;
