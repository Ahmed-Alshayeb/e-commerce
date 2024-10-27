import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createProductValidation = {
  body: joi
    .object({
      
      name: joi.string().min(2).max(30),
      description: joi.string().min(10).max(1000),
      category: generalFields.id,
      subCategory: generalFields.id,
      brand: generalFields.id,
      discount: joi.number().positive().min(1).max(100).optional(),
      price: joi.number().positive().min(0).max(10000000),
      stock: joi.number().integer().positive().min(0).max(1000000),
      rateAvg: joi.number().positive().min(0).max(5).optional(),
    })
    .options({ presence: "required" }),

  file: joi.object({
    image: joi.array().items(generalFields.file.required()).required(),
    coverImages: joi.array().items(generalFields.file.required()).required(),
  }),

  headers: generalFields.headers.required(),
};

export const updateProductValidation = {
  body: joi.object({
    name: joi.string().min(2).max(30).optional(),
    description: joi.string().min(10).max(1000).optional(),
    category: generalFields.id.required(),
    subCategory: generalFields.id.required(),
    brand: generalFields.id.required(),
    discount: joi.number().positive().min(1).max(100).optional().optional(),
    price: joi.number().positive().min(0).max(10000000).optional(),
    stock: joi.number().integer().positive().min(0).max(1000000).optional(),
  }),

  file: joi.object({
    image: joi.array().items(generalFields.file),
    coverImages: joi.array().items(generalFields.file),
  }),

  headers: generalFields.headers.required(),
};

export const deleteProductValidation = {
  headers: generalFields.headers.required(),

  params: joi.object({
    id: generalFields.id.required(),
  }),
};

export const getProductValidation = {
  headers: generalFields.headers.required(),
};
