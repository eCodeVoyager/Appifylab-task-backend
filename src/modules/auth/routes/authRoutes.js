const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validatorMiddleware');
const authValidation = require('../validations/authValidation');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh', validate(authValidation.refreshToken), authController.refresh);
router.get('/me', authenticate, authController.currentUser);

module.exports = router;
