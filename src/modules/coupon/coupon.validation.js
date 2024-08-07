import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createCouponValidation = {
  body: joi.object({
    code: joi.string().min(3).max(30).required(),
    amount: joi.number().integer().positive().min(1).max(100).required(),
    fromDate: joi.date().greater(Date.now()).required(),
    toDate: joi.date().greater(joi.ref("fromDate")).required(),
  }),

  headers: generalFields.headers.required(),
};

export const updateCouponValidation = {
  body: joi.object({
    code: joi.string().min(3).max(30),
    amount: joi.number().integer().positive().min(1).max(100),
    fromDate: joi.date().greater(Date.now()),
    toDate: joi.date().greater(joi.ref("fromDate")),
  }),

  headers: generalFields.headers.required(),
};

export const deleteCouponValidation = {
  headers: generalFields.headers.required(),
};

export const getCouponsValidation = {
  headers: generalFields.headers.required(),
};
