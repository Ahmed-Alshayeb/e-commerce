import { Router } from "express";

import * as PC from "./product.controller.js";
import * as PV from "./product.validation.js";
import { auth } from "../../middleware/auth.js";
import { roleSystem } from "../../utils/roleSystem.js";
import { validation } from "../../middleware/validation.js";
import { multerHost, validExtension } from "../../middleware/uploadImage.js";
import reviewRouter from "../review/review.routes.js";
import wishListRouter from "../wishList/wishList.routes.js";

const productRouter = Router();

productRouter.use("/:productId/reviews", reviewRouter);
productRouter.use("/:productId/wishlists", wishListRouter);

productRouter.post(
  "/",
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 5 },
  ]),
  validation(PV.createProductValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  PC.createProduct
);

productRouter.get(
  "/",
  validation(PV.getProductValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  PC.getProducts
);

productRouter.patch(
  "/:id",
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 5 },
  ]),
  validation(PV.updateProductValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  PC.updateProduct
);

productRouter.delete(
  "/:id",
  validation(PV.deleteProductValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  PC.deleteProduct
);
 

export default productRouter;
