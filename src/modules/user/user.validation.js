import joi from "joi";
import { roleSystem } from "../../utils/roleSystem.js";
import { generalFields } from "../../utils/generalFields.js";

export const signUpValidation = {
  body: joi
    .object({
      name: joi.string().alphanum().min(3).max(30),
      email: joi.string().email(),
      phone: joi.array().items(joi.string().length(11)),
      age: joi.number().min(18).max(100),
      address: joi.array().items(joi.string()),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ),
      cPassword: joi.string().valid(joi.ref("password")),
      role: joi.string().valid(roleSystem.Admin, roleSystem.User).optional(),
    })
    .options({ presence: "required" }),
};

export const signInValidation = {
  body: joi
    .object({
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ),
    })
    .options({ presence: "required" }),
};

export const updateUserValidation = {
  body: joi
    .object({
      name: joi.string().min(3).max(30),
      email: joi.string().email(),
      phone: joi.string().length(11),
      age: joi.array().items(joi.number().min(18).max(100)),
      address: joi.array().items(joi.string()),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ),
      cPassword: joi.string().valid(joi.ref("password")),
      role: joi.string().valid(roleSystem.Admin, roleSystem.User).optional(),
    })
    .options({ presence: "optional" }),

  headers: generalFields.headers.required(),
};

export const deleteUserValidation = {
  headers: generalFields.headers.required(),
};

export const updatePasswordValidation = {
  body: joi.object({
    oldPassword: joi.string().required(),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  }),
  headers: generalFields.headers.required(),
};

export const forgetPasswordValidation = {
  body: joi.object({
    email: joi.string().email().required(),
  }),
};

export const resetPasswordValidation = {
  body: joi.object({
    email: joi.string().email().required(),
    OTP: joi.string().length(6).required(),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required(),
  }),
};
