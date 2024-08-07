import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { roleSystem } from "../../utils/roleSystem.js";
import { validation } from "../../middleware/validation.js";
import * as BV from "./brand.validation.js";
import * as BC from "./brand.controller.js";
import { multerHost, validExtension } from "../../middleware/uploadImage.js";

const router = Router();
 
router.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validation(BV.createBrandValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  BC.createBrand
);

router.patch(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(BV.updateBrandValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  BC.updateBrand
);

router.delete(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(BV.deleteBrandValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  BC.deleteBrand
);

router.get(
  "/",
  validation(BV.getBrandsValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  BC.getbrands
);

export default router;
