import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createSubCategoryValidation = {
  body: joi
    .object({
      name: joi.string().min(2).max(30),
      category: generalFields.id.optional(),
    })
    .options({ presence: "required" }),

  file: generalFields.file.required(),

  headers: generalFields.headers.required(),
};

export const updateSubCategoryValidation = {
  body: joi.object({
    name: joi.string().min(3).max(30).required(),
    category: generalFields.id.optional(),
  }),

  headers: generalFields.headers.required(),
};

export const deleteSubCategoryValidation = {
  headers: generalFields.headers.required(),
};

export const getSubCategoriesValidation = {
  headers: generalFields.headers.required(),
};
