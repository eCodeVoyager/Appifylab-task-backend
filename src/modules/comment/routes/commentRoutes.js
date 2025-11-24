const express = require('express');
const commentController = require('../controllers/commentController');
const authenticate = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validatorMiddleware');
const commentValidation = require('../validations/commentValidation');

const router = express.Router();

router.post(
  '/post/:postId',
  authenticate,
  validate(commentValidation.addComment),
  commentController.addComment
);
router.post(
  '/:commentId/reply',
  authenticate,
  validate(commentValidation.addReply),
  commentController.addReply
);
router.get(
  '/post/:postId',
  authenticate,
  validate(commentValidation.getComments),
  commentController.getCommentsByPost
);
router.get(
  '/:commentId/replies',
  authenticate,
  validate(commentValidation.getReplies),
  commentController.getRepliesByComment
);
router.delete(
  '/:id',
  authenticate,
  validate(commentValidation.deleteComment),
  commentController.deleteComment
);

module.exports = router;
