const express = require('express');
const likeController = require('../controllers/likeController');
const authenticate = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validatorMiddleware');
const likeValidation = require('../validations/likeValidation');

const router = express.Router();

router.post(
  '/:targetType/:targetId',
  authenticate,
  validate(likeValidation.targetParams),
  likeController.toggleLike
);
router.get(
  '/:targetType/:targetId/users',
  authenticate,
  validate(likeValidation.getLikesByTarget),
  likeController.getLikesByTarget
);
router.get(
  '/:targetType/:targetId/count',
  authenticate,
  validate(likeValidation.targetParams),
  likeController.getLikeCount
);
router.get(
  '/:targetType/:targetId/check',
  authenticate,
  validate(likeValidation.targetParams),
  likeController.checkUserLiked
);

module.exports = router;
