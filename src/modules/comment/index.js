const commentController = require('./controllers/commentController');
const commentModel = require('./models/commentModel');
const commentRoutes = require('./routes/commentRoutes');
const commentService = require('./services/commentService');
const commentValidation = require('./validations/commentValidation');

module.exports = {
  commentController,
  commentModel,
  commentRoutes,
  commentService,
  commentValidation,
};
