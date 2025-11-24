const Joi = require('joi');

const objectId = Joi.string()
  .trim()
  .length(24)
  .hex()
  .regex(/^[a-fA-F0-9]{24}$/)
  .message('Invalid MongoDB ObjectId');

module.exports = {
  objectId,
};
