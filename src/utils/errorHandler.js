const ApiError = require('./apiError');

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, 'Route Not Found');
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  if (err instanceof SyntaxError && err.type === 'entity.parse.failed' && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
      error: err.message,
      details: err.body,
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    err = new ApiError(400, 'Validation Error', messages);
  }

  if (err.code && err.code === 11000) {
    const message = 'Duplicate field value entered';
    err = new ApiError(400, message);
  }

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value || req.params.id || 'unknown'}`;
    err = new ApiError(404, message);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
