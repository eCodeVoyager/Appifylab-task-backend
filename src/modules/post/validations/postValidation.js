const Joi = require('joi');

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
  getPostById,
  getFeed,
};
