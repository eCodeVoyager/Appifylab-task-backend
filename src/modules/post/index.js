const postController = require('./controllers/postController');
const postModel = require('./models/postModel');
const postRoutes = require('./routes/postRoutes');
const postService = require('./services/postService');
const postValidation = require('./validations/postValidation');

module.exports = {
  postController,
  postModel,
  postRoutes,
  postService,
  postValidation,
};
