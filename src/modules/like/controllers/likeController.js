const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const likeService = require('../services/likeService');
const { status } = require('http-status');

const toggleLike = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const result = await likeService.toggleLike(targetType, targetId, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, result, result.message));
});

const getLikesByTarget = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const result = await likeService.getLikesByTarget(targetType, targetId, req.query);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Likes retrieved successfully'));
});

const getLikeCount = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const result = await likeService.getLikeCount(targetType, targetId);
  res
    .status(status.OK)
    .json(new ApiResponse(status.OK, result, 'Like count retrieved successfully'));
});

const checkUserLiked = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const result = await likeService.checkUserLiked(targetType, targetId, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Like status retrieved'));
});

module.exports = {
  toggleLike,
  getLikesByTarget,
  getLikeCount,
  checkUserLiked,
};
