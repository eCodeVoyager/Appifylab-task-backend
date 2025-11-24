const Joi = require('joi');

const addComment = {
  params: Joi.object({
    postId: Joi.string().required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
  }),
};

const addReply = {
  params: Joi.object({
    commentId: Joi.string().required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
  }),
};

const getComments = {
  params: Joi.object({
    postId: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

const getReplies = {
  params: Joi.object({
    commentId: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

const deleteComment = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = {
  addComment,
  addReply,
  getComments,
  getReplies,
  deleteComment,
};
