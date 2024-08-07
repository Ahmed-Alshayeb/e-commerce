import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createOrderValidation = {
  body: joi.object({
    productId: generalFields.id,
    quantity: joi.number().integer().positive().min(1),
    couponCode: joi.string(),
    address: joi.string().required(),
    phone: joi.string().required(),
    paymentMethod: joi.string().valid("cash", "card").required(),
  }),

  headers: generalFields.headers.required(),
};

export const canceleOrderValidation = {
  body: joi.object({
    reason: joi.string().required(),
  }),

  headers: generalFields.headers.required(),
};
