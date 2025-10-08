export const globalError = (err, req, res, next) => {

  let code = err.statusCode || 500;
  res.status(code).json({
    error: "error",
    message:err.stack,
    code: code,
    // stack: err.stack
  });
};
