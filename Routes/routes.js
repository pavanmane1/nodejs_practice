const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authroutes');
const productRoutes = require('./productsRoutes');
const expensetrackingRoutes = require('./expensetrackingRoutes');
const router = express.Router();


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/expensetracking', expensetrackingRoutes);
module.exports = router;
