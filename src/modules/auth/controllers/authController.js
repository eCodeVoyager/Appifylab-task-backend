const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const authService = require('../services/authService');
const { status } = require('http-status');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(status.CREATED).json(new ApiResponse(status.CREATED, result, 'User registered successfully'));
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Login successful'));
});

const currentUser = catchAsync(async (req, res) => {
  const user = await authService.currentUser(req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, user, 'Current user retrieved successfully'));
});

const refresh = catchAsync(async (req, res) => {
  const result = await authService.refresh(req.body);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Token refreshed successfully'));
});

module.exports = {
  register,
  login,
  currentUser,
  refresh,
};
