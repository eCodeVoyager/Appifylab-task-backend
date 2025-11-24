const likeModel = require('../models/likeModel');
const postModel = require('../../post/models/postModel');
const commentModel = require('../../comment/models/commentModel');
const ApiError = require('../../../utils/apiError');

const toggleLike = async (targetType, targetId, userId) => {
  let target;
  if (targetType === 'post') {
    target = await postModel.findById(targetId);
  } else if (targetType === 'comment') {
    target = await commentModel.findById(targetId);
  }

  if (!target) {
    throw ApiError.notFound(
      `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} not found`
    );
  }

  const existingLike = await likeModel.findOne({ targetType, targetId, user: userId });

  if (existingLike) {
    await likeModel.deleteOne({ _id: existingLike._id });
    return {
      isLiked: false,
      message: `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} unliked`,
    };
  } else {
    await likeModel.create({ targetType, targetId, user: userId });
    return {
      isLiked: true,
      message: `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} liked`,
    };
  }
};

const getLikesByTarget = async (targetType, targetId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  let target;
  if (targetType === 'post') {
    target = await postModel.findById(targetId);
  } else if (targetType === 'comment') {
    target = await commentModel.findById(targetId);
  }

  if (!target) {
    throw ApiError.notFound(
      `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} not found`
    );
  }

  const likes = await likeModel
    .find({ targetType, targetId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email');

  const total = await likeModel.countDocuments({ targetType, targetId });

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

const getLikeCount = async (targetType, targetId) => {
  let target;
  if (targetType === 'post') {
    target = await postModel.findById(targetId);
  } else if (targetType === 'comment') {
    target = await commentModel.findById(targetId);
  }

  if (!target) {
    throw ApiError.notFound(
      `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} not found`
    );
  }

  const count = await likeModel.countDocuments({ targetType, targetId });
  return { count };
};

const checkUserLiked = async (targetType, targetId, userId) => {
  const like = await likeModel.findOne({ targetType, targetId, user: userId });
  return { isLiked: !!like };
};

module.exports = {
  toggleLike,
  getLikesByTarget,
  getLikeCount,
  checkUserLiked,
};
