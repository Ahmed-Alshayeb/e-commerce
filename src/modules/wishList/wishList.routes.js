import { Router } from "express";
import * as WC from "./wishList.controller.js";
import * as WV from "./wishList.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { roleSystem } from "../../utils/roleSystem.js";
 
const wishListRouter = Router({ mergeParams: true });

wishListRouter.post(
  "/",
  validation(WV.createWishListValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  WC.createWishList
);

wishListRouter.patch(
  "/",
  validation(WV.deleteWishListValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  WC.deleteWishList
);

export default wishListRouter;
