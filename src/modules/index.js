const express = require('express');
const authRoutes = require('./auth/routes/authRoutes');
const postRoutes = require('./post/routes/postRoutes');
const likeRoutes = require('./like/routes/likeRoutes');
const commentRoutes = require('./comment/routes/commentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
