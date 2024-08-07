export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};

export const globalError = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    ...(isProduction ? {} : { stack: err.stack, error: err }),
  });

  next();
};
