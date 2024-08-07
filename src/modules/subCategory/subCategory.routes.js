import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as SCC from "./subCategory.controller.js";
import { validation } from "../../middleware/validation.js";
import * as SCV from "./subCategory.validation.js";
import { roleSystem } from "../../utils/roleSystem.js";
import { multerHost, validExtension } from "../../middleware/uploadImage.js";

const subCategoryrouter = Router();

subCategoryrouter.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validation(SCV.createSubCategoryValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  SCC.createSubCategory
);

subCategoryrouter.patch(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(SCV.updateSubCategoryValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  SCC.updateSubCategory
);
subCategoryrouter.get(
  "/",
  validation(SCV.getSubCategoriesValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  SCC.getSubCategories
);

subCategoryrouter.delete(
  "/:id",
  validation(SCV.deleteSubCategoryValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  SCC.deleteSubCategory
);

export default subCategoryrouter;
