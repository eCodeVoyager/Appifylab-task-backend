const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const postService = require('../services/postService');
const { status } = require('http-status');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost({ ...req.body, userId: req.user.id });
  res
    .status(status.CREATED)
    .json(new ApiResponse(status.CREATED, post, 'Post created successfully'));
});

const getFeed = catchAsync(async (req, res) => {
  const result = await postService.getFeed({ ...req.query, userId: req.user.id });
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Feed retrieved successfully'));
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.id, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, post, 'Post retrieved successfully'));
});

const getMyPosts = catchAsync(async (req, res) => {
  const result = await postService.getMyPosts({ ...req.query, userId: req.user.id });
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'My posts retrieved successfully'));
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, post, 'Post updated successfully'));
});

const deletePost = catchAsync(async (req, res) => {
  const result = await postService.deletePost(req.params.id, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Post deleted successfully'));
});

module.exports = {
  createPost,
  getFeed,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
