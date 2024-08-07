const dataMethods = ["body", "query", "params", "headers", "file", "files"];

export const validation = (schema) => {
  return (req, res, next) => {
    let arrError = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error?.details) {
          error.details.forEach((err) => {
            arrError.push(err.message);
          });
        }
      }
    });
    if (arrError.length) {
      return res.status(400).json({ msg: "validation error", error: arrError });
    }
    next();
  };
};
