const express = require('express');
const authRoutes = require('./auth/routes/authRoutes');
const postRoutes = require('./post/routes/postRoutes');
const likeRoutes = require('./like/routes/likeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/likes', likeRoutes);

module.exports = router;
