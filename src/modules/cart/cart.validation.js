import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createCartValidation = {
  body: joi.object({
    productId: generalFields.id.required(),
    quantity: joi.number().integer().positive().min(1).max(100).required(),
  }),

  headers: generalFields.headers.required(),
};

export const removeCartValidation = {
  body: joi.object({
    productId: generalFields.id.required(),
  }),

  headers: generalFields.headers.required(),
};

export const clearCartValidation = {
  headers: generalFields.headers.required(),
};
