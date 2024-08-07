import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createWishListValidation = {
  params: joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};

export const deleteWishListValidation = {
  params: joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
