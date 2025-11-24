const likeModel = require('../models/likeModel');
const postModel = require('../../post/models/postModel');
const ApiError = require('../../../utils/apiError');

const toggleLike = async (postId, userId) => {
  const post = await postModel.findById(postId);
  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  const existingLike = await likeModel.findOne({ post: postId, user: userId });

  if (existingLike) {
    await likeModel.deleteOne({ _id: existingLike._id });
    return {
      isLiked: false,
      message: 'Post unliked',
    };
  } else {
    await likeModel.create({ post: postId, user: userId });
    return {
      isLiked: true,
      message: 'Post liked',
    };
  }
};

const getLikesByPost = async (postId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const post = await postModel.findById(postId);
  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  const likes = await likeModel
    .find({ post: postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email');

  const total = await likeModel.countDocuments({ post: postId });

  return {
    likes: likes.map(like => like.user),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getLikeCount = async postId => {
  const post = await postModel.findById(postId);
  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  const count = await likeModel.countDocuments({ post: postId });
  return { count };
};

const checkUserLiked = async (postId, userId) => {
  const like = await likeModel.findOne({ post: postId, user: userId });
  return { isLiked: !!like };
};

module.exports = {
  toggleLike,
  getLikesByPost,
  getLikeCount,
  checkUserLiked,
};
