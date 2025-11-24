const likeController = require('./controllers/likeController');
const likeModel = require('./models/likeModel');
const likeRoutes = require('./routes/likeRoutes');
const likeService = require('./services/likeService');
const likeValidation = require('./validations/likeValidation');

module.exports = {
  likeController,
  likeModel,
  likeRoutes,
  likeService,
  likeValidation,
};
