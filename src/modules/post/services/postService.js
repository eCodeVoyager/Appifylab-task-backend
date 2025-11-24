const postModel = require('../models/postModel');
const ApiError = require('../../../utils/apiError');

const createPost = async ({ content, media, privacy, userId }) => {
  const post = new postModel({
    content,
    media,
    privacy,
    author: userId,
  });
  await post.save();
  return await post.populate('author', 'firstName lastName email');
};

const getFeed = async ({ page = 1, limit = 10, userId }) => {
  const skip = (page - 1) * limit;

  const posts = await postModel
    .find({
      isDeleted: false,
      $or: [{ privacy: 'public' }, { author: userId }],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName email');

  const total = await postModel.countDocuments({
    isDeleted: false,
    $or: [{ privacy: 'public' }, { author: userId }],
  });

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId, userId) => {
  const post = await postModel
    .findOne({ _id: postId, isDeleted: false })
    .populate('author', 'firstName lastName email');

  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  if (post.privacy === 'private' && post.author._id.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to view this post');
  }

  return post;
};

const getMyPosts = async ({ page = 1, limit = 10, userId }) => {
  const skip = (page - 1) * limit;

  const posts = await postModel
    .find({ author: userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName email');

  const total = await postModel.countDocuments({ author: userId, isDeleted: false });

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updatePost = async (postId, updateData, userId) => {
  const post = await postModel.findOne({ _id: postId, isDeleted: false });

  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  if (post.author.toString() !== userId) {
    throw ApiError.forbidden('You can only update your own posts');
  }

  Object.assign(post, updateData);
  await post.save();

  return await post.populate('author', 'firstName lastName email');
};

const deletePost = async (postId, userId) => {
  const post = await postModel.findOne({ _id: postId, isDeleted: false });

  if (!post) {
    throw ApiError.notFound('Post not found');
  }

  if (post.author.toString() !== userId) {
    throw ApiError.forbidden('You can only delete your own posts');
  }

  post.isDeleted = true;
  await post.save();

  return { message: 'Post deleted successfully' };
};

module.exports = {
  createPost,
  getFeed,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
