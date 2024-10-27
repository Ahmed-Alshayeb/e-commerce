import joi from "joi";

export const generalFields = {
  email: joi.string().email().required(),

  password: joi
    .string()
    .min(8)
    .max(30)
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),

  id: joi.string().length(24).hex(),

  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    fieldname: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    buffer: joi.string(),
  }),

  headers: joi.object({
    "cookie": joi.string(),
    "postman-token": joi.string(),
    "cache-control": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    "postman-token": joi.string(),
    "user-agent": joi.string(),
    "accept-encoding": joi.string().required(),
    accept: joi.string(),
    host: joi.string(),
    connection: joi.string(),

    token: joi.string().required(),
  }),
};
