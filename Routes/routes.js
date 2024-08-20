const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authroutes');

const router = express.Router();


router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
