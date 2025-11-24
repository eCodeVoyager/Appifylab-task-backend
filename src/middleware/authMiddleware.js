const { status } = require('http-status');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/jwtToken');

function extractToken(req) {
  return (
    req.cookies?.token ||
    req.headers['authorization']?.split(' ')[1] ||
    req.headers['x-access-token'] ||
    null
  );
}

const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(new ApiError(status.UNAUTHORIZED, 'Access denied. No token provided'));
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(status.UNAUTHORIZED, 'Token has expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(status.UNAUTHORIZED, 'Invalid token'));
    }
    return next(new ApiError(status.UNAUTHORIZED, 'Authentication failed'));
  }
};

module.exports = authenticate;
