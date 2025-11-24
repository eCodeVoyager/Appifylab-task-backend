const Joi = require('joi');

const createPost = {
  body: Joi.object({
    content: Joi.string().required(),
    media: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        type: Joi.string().valid('image', 'video').required(),
      })
    ),
    privacy: Joi.string().valid('public', 'private', 'friends').default('public'),
  }),
};

const updatePost = {
  body: Joi.object({
    content: Joi.string(),
    privacy: Joi.string().valid('public', 'private', 'friends'),
  }),
};

const getPostById = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const getFeed = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

module.exports = {
  createPost,
  updatePost,
  getPostById,
  getFeed,
};
