const commentModel = require('../models/commentModel');
const postModel = require('../../post/models/postModel');
const ApiError = require('../../../utils/apiError');

const addComment = async ({ content, postId, userId }) => {
  const post = await postModel.findById(postId);
  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  const comment = await commentModel.create({
    content,
    post: postId,
    author: userId,
  });

  return await comment.populate('author', 'firstName lastName email');
};

const addReply = async ({ content, commentId, userId }) => {
  const parentComment = await commentModel.findById(commentId);
  if (!parentComment) {
    throw ApiError.notFound('Comment not found');
  }

  const reply = await commentModel.create({
    content,
    post: parentComment.post,
    parentComment: commentId,
    author: userId,
  });

  return await reply.populate('author', 'firstName lastName email');
};

const getCommentsByPost = async (postId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const post = await postModel.findById(postId);
  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  const comments = await commentModel
    .find({ post: postId, parentComment: null, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName email');

  const total = await commentModel.countDocuments({
    post: postId,
    parentComment: null,
    isDeleted: false,
  });

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getRepliesByComment = async (commentId, { page = 1, limit = 20 }) => {
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }

  const skip = (page - 1) * limit;

  const replies = await commentModel
    .find({ parentComment: commentId, isDeleted: false })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName email');

  const total = await commentModel.countDocuments({
    parentComment: commentId,
    isDeleted: false,
  });

  return {
    replies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const deleteComment = async (commentId, userId) => {
  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }

  if (comment.author.toString() !== userId) {
    throw ApiError.forbidden('You can only delete your own comments');
  }

  comment.isDeleted = true;
  await comment.save();

  return { message: 'Comment deleted successfully' };
};

module.exports = {
  addComment,
  addReply,
  getCommentsByPost,
  getRepliesByComment,
  deleteComment,
};
