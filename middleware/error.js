const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err.stack.red);
  if (err.name === "CastError") {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  //Mongoose bad object id
  console.log(err.name);
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
