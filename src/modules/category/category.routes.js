import { Router } from "express";
import * as CC from "./category.controller.js";
import * as CV from "./category.validation.js";
import { auth } from "../../middleware/auth.js";
import { roleSystem } from "../../utils/roleSystem.js";
import { validation } from "../../middleware/validation.js";
import { multerHost, validExtension } from "../../middleware/uploadImage.js";

const categoryRouter = Router();

categoryRouter.get(
  "/",
  validation(CV.getCategoriesValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CC.getCategories
);

categoryRouter.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validation(CV.createCategoryValidation),
  auth([roleSystem.Admin]),
  CC.createCategory
);

categoryRouter.patch(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(CV.updateCategoryValidation),
  auth([roleSystem.Admin]),
  CC.updateCategory
);

categoryRouter.delete(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(CV.deleteCategoryValidation),
  auth([roleSystem.Admin]),
  CC.deleteCategory
);

export default categoryRouter;
