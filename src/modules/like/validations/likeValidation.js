const Joi = require('joi');

const postIdParam = {
  params: Joi.object({
    postId: Joi.string().required(),
  }),
};

const getLikesByPost = {
  params: Joi.object({
    postId: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = {
  postIdParam,
  getLikesByPost,
};
