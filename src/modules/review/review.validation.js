import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createReiewValidation = {
  body: joi.object({
    comment: joi.string().min(2).required(),
    rate: joi.number().min(1).max(5).required(),
  }),
  params: joi.object({
    productId: generalFields.id.required(),
  }),

  headers: generalFields.headers.required(),
};

export const deleteReviewValidation = {
  headers: generalFields.headers.required(),
};

