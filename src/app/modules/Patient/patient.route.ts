import express from "express";
import { PatientControllers } from "./patient.controller";

const router = express.Router();

router.get("/", PatientControllers.getAllPatientFromDB);
router.get("/:id", PatientControllers.getSinglePatientFromDB);
router.patch("/:id", PatientControllers.updatePatientData);

export const PatientRoutes = router;
