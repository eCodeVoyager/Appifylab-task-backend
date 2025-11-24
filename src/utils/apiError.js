function ApiError(statusCode, message, errors = [], stack) {
  Error.call(this, message);
  this.statusCode = statusCode;
  this.message = message || 'Something went wrong';
  this.success = false;
  this.errors = errors;

  if (stack) {
    this.stack = stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

ApiError.createError = function (statusCode, message, errors = []) {
  return new ApiError(statusCode, message, errors);
};

ApiError.badRequest = function (message, errors = []) {
  return ApiError.createError(400, message, errors);
};

ApiError.notFound = function (message, errors = []) {
  return ApiError.createError(404, message, errors);
};

ApiError.forbidden = function (message, errors = []) {
  return ApiError.createError(403, message, errors);
};

ApiError.unauthorized = function (message, errors = []) {
  return ApiError.createError(401, message, errors);
};

ApiError.conflict = function (message, errors = []) {
  return ApiError.createError(409, message, errors);
};

ApiError.internal = function (message, errors = []) {
  return ApiError.createError(500, message, errors);
};

module.exports = ApiError;
