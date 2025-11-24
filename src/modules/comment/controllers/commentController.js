const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const commentService = require('../services/commentService');
const { status } = require('http-status');

const addComment = catchAsync(async (req, res) => {
  const comment = await commentService.addComment({
    content: req.body.content,
    postId: req.params.postId,
    userId: req.user.id,
  });
  res
    .status(status.CREATED)
    .json(new ApiResponse(status.CREATED, comment, 'Comment added successfully'));
});

const addReply = catchAsync(async (req, res) => {
  const reply = await commentService.addReply({
    content: req.body.content,
    commentId: req.params.commentId,
    userId: req.user.id,
  });
  res
    .status(status.CREATED)
    .json(new ApiResponse(status.CREATED, reply, 'Reply added successfully'));
});

const getCommentsByPost = catchAsync(async (req, res) => {
  const result = await commentService.getCommentsByPost(req.params.postId, req.query);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Comments retrieved successfully'));
});

const getRepliesByComment = catchAsync(async (req, res) => {
  const result = await commentService.getRepliesByComment(req.params.commentId, req.query);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Replies retrieved successfully'));
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await commentService.deleteComment(req.params.id, req.user.id);
  res.status(status.OK).json(new ApiResponse(status.OK, result, 'Comment deleted successfully'));
});

module.exports = {
  addComment,
  addReply,
  getCommentsByPost,
  getRepliesByComment,
  deleteComment,
};
