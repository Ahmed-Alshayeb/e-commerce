import { Router } from "express";
import * as CPC from "./coupon.controller.js";
import * as CPV from "./coupon.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { roleSystem } from "../../utils/roleSystem.js";

const couponRouter = Router();
 
couponRouter.post(
  "/",
  validation(CPV.createCouponValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CPC.createCoupon
);
couponRouter.patch(
  "/:id",
  validation(CPV.updateCouponValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CPC.updateCoupon
);
couponRouter.get(
  "/",
  validation(CPV.getCouponsValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CPC.getCoupons
);
couponRouter.delete(
  "/:id",
  validation(CPV.deleteCouponValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  CPC.deleteCoupon
);

export default couponRouter;
