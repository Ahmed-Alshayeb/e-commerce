import { Router } from "express";
import * as CC from "./cart.controller.js";
import * as CV from "./cart.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { roleSystem } from "../../utils/roleSystem.js";

const cartRouter = Router();

cartRouter.post(
  "/",
  validation(CV.createCartValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CC.createCart
);
 
cartRouter.patch(
  "/",
  validation(CV.removeCartValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CC.removeCart
);

cartRouter.put(
  "/",
  validation(CV.clearCartValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CC.clearCart
);

export default cartRouter;
