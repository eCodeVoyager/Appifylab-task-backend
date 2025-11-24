const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const likeService = require('../services/likeService');
const { status } = require('http-status');

const toggleLike = catchAsync(async (req, res) => {
  const result = await likeService.toggleLike(req.params.postId, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, result, result.message));
});

const getLikesByPost = catchAsync(async (req, res) => {
  const result = await likeService.getLikesByPost(req.params.postId, req.query);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Likes retrieved successfully'));
});

const getLikeCount = catchAsync(async (req, res) => {
  const result = await likeService.getLikeCount(req.params.postId);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Like count retrieved successfully'));
});

const checkUserLiked = catchAsync(async (req, res) => {
  const result = await likeService.checkUserLiked(req.params.postId, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Like status retrieved'));
});

module.exports = {
  toggleLike,
  getLikesByPost,
  getLikeCount,
  checkUserLiked,
};
