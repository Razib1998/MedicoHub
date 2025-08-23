import express from "express";
import { DoctorControllers } from "./doctor.controller";

const router = express.Router();

router.get("/", DoctorControllers.getAllDoctorFromDB);
router.get("/:id", DoctorControllers.getSingleDoctorFromDB);
router.delete("/:id", DoctorControllers.deletedDoctorFromDB);
router.patch("/:id", DoctorControllers.updateDoctorData);

export const DoctorRoutes = router;
