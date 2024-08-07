import { Router } from "express";

import * as UC from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { roleSystem } from "../../utils/roleSystem.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js";

const router = Router();

router.get("/", auth([roleSystem.Admin, roleSystem.User]), UC.getUsers);
router.post("/signUp", validation(UV.signUpValidation), UC.signUp);
router.post("/signIn", validation(UV.signInValidation), UC.signIn);
router.get("/verifyEmail/:token", UC.verifyEmail);
router.get("/rfToken/:rfToken", UC.rfToken);
router.patch("/forgetPassword", UC.forgetPassword);

router.patch(
  "/resetPassword",
  auth([roleSystem.Admin, roleSystem.User]),
  validation(UV.resetPasswordValidation),
  UC.resetPassword
);

router.patch(
  "/updatePassword",
  auth([roleSystem.Admin, roleSystem.User]),
  validation(UV.updatePasswordValidation),
  UC.updatePassword
);

router.patch(
  "/",
  auth([roleSystem.Admin, roleSystem.User]),
  validation(UV.updateUserValidation),
  UC.updateUser
);

router.delete(
  "/",
  auth([roleSystem.Admin, roleSystem.User]),
  validation(UV.deleteUserValidation),
  UC.deleteUser
);

export default router;
