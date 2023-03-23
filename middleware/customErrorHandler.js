function customErrorHandler(error, req, res, next) {
  console.log(error);
  res.stauts(400).json({
    stauts: "error",
    message: error.message,
  });
}

module.exports = customErrorHandler;
