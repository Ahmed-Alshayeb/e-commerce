import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createBrandValidation = {
  body: joi
    .object({
      name: joi.string().min(2).max(30),
    })
    .options({ presence: "required" }),

  headers: generalFields.headers.required(),
};

export const updateBrandValidation = {
  body: joi.object({
    name: joi.string().min(2).max(30).optional(),
  }),

  headers: generalFields.headers.required(),
};

export const deleteBrandValidation = {
  headers: generalFields.headers.required(),
};

export const getBrandsValidation = {
  headers: generalFields.headers.required(),
};
