const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authroutes');
const productRoutes = require('./productsRoutes');
const router = express.Router();


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/product', productRoutes);

module.exports = router;
