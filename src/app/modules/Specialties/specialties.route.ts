import express, { NextFunction, Request, Response } from "express";
import { multerUpload } from "../../config/multer.config";
import { SpecialtiesValidation } from "./specialties.validation";
import { SpecialtiesControllers } from "./specialties.controller";

const router = express.Router();

router.get("/", SpecialtiesControllers.getAllSpecialtiesFromDB);
router.post(
  "/create-specialties",
  multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createSpecialties.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesControllers.createSpecialtiesIntoDB(req, res, next);
  }
);
router.delete("/:id", SpecialtiesControllers.deleteSpecialtiesFromDB);

export const SpecialtiesRoutes = router;
