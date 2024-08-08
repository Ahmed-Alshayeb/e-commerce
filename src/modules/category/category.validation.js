import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createCategoryValidation = {
  body: joi
    .object({
      title: joi.string().min(3).max(30),
    })
    .options({ presence: "required" }),

  headers: generalFields.headers.required(),
};

export const updateCategoryValidation = {
  body: joi.object({
    title: joi.string().min(3).max(30).optional(),
  }),

  headers: generalFields.headers.required(),
};

export const deleteCategoryValidation = {
  headers: generalFields.headers.required(),
};

