const errorHandler = (err, req, res, next) => {
  res.statusCode = err.statusCode;
  res.send(err);
};

export { errorHandler };
