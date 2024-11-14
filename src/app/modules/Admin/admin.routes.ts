import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../Shared/validateRequest";
import { AdminValidationSchema } from "./admin.validation";

const router = express.Router();

router.get("/", AdminControllers.getAllAdminFromDB);
router.get("/:id", AdminControllers.getSingleAdminFromDB);
router.patch(
  "/:id",
  validateRequest(AdminValidationSchema.updateAdminValidation),
  AdminControllers.updateAdminIntoDB
);
router.delete("/:id", AdminControllers.deletedAdminFromDB);
router.delete("/softDelete/:id", AdminControllers.adminSoftDeleteFromDB);

export const AdminRoutes = router;
