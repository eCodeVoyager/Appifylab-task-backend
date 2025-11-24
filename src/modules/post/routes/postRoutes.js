const express = require('express');
const postController = require('../controllers/postController');
const authenticate = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validatorMiddleware');
const postValidation = require('../validations/postValidation');
const { uploadMultiple } = require('../../../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', authenticate, uploadMultiple, postController.createPost);
router.get('/feed', authenticate, validate(postValidation.getFeed), postController.getFeed);
router.get('/my-posts', authenticate, validate(postValidation.getFeed), postController.getMyPosts);
router.get('/:id', authenticate, validate(postValidation.getPostById), postController.getPostById);
router.patch('/:id', authenticate, uploadMultiple, postController.updatePost);
router.delete(
  '/:id',
  authenticate,
  validate(postValidation.getPostById),
  postController.deletePost
);

module.exports = router;
