const express = require('express');
const likeController = require('../controllers/likeController');
const authenticate = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validatorMiddleware');
const likeValidation = require('../validations/likeValidation');

const router = express.Router();

router.post('/post/:postId', authenticate, validate(likeValidation.postIdParam), likeController.toggleLike);
router.get('/post/:postId/users', authenticate, validate(likeValidation.getLikesByPost), likeController.getLikesByPost);
router.get('/post/:postId/count', authenticate, validate(likeValidation.postIdParam), likeController.getLikeCount);
router.get('/post/:postId/check', authenticate, validate(likeValidation.postIdParam), likeController.checkUserLiked);

module.exports = router;
