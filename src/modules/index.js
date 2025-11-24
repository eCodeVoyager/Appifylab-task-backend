const express = require('express');
const authRoutes = require('./auth/routes/authRoutes');
const postRoutes = require('./post/routes/postRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

module.exports = router;
