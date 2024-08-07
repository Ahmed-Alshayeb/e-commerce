import { Router } from "express";
import * as RC from "./review.controller.js";
import * as RV from "./review.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { roleSystem } from "../../utils/roleSystem.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.post(
  "/",
  validation(RV.createReiewValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  RC.createReview
);

reviewRouter.delete(
  "/:id",
  validation(RV.deleteReviewValidation),
  auth([roleSystem.Admin, roleSystem.User]),
  RC.deleteReview
);

export default reviewRouter;
 