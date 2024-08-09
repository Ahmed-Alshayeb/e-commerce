import { Router } from "express";
import * as OC from "./order.controller.js";
import * as OV from "./order.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { roleSystem } from "../../utils/roleSystem.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  validation(OV.createOrderValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  OC.createOrder
);

orderRouter.patch(
  "/:id",
  validation(OV.canceleOrderValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  OC.canceleOrder
);

orderRouter.post("/webhook", express.raw({ type: "application/json" }), OC.webhook);

export default orderRouter;
