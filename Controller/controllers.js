const userController = require('./userController');
const authController = require('./authcontroller'); // Ensure correct case and path
const productController = require('./productsController');
const expensetrackingController = require('./expensetrackingController');

module.exports = {
    userController,
    authController,
    productController,
    expensetrackingController
};
