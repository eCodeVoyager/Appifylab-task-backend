const Joi = require('joi');

const targetParams = {
  params: Joi.object({
    targetType: Joi.string().valid('post', 'comment').required(),
    targetId: Joi.string().required(),
  }),
};

const getLikesByTarget = {
  params: Joi.object({
    targetType: Joi.string().valid('post', 'comment').required(),
    targetId: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = {
  targetParams,
  getLikesByTarget,
};
