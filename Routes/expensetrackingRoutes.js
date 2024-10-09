const express = require("express")
const router = express.Router();
const { expensetrackingController } = require("../Controller/controllers");

// User routes
router.post('/users', expensetrackingController.createNewUsertoServerdb);
router.post('/userslogin', expensetrackingController.LoginUsertopg);
router.get('/users', expensetrackingController.getAllUsers);

// Category routes
router.post('/categories', expensetrackingController.createCategory);
router.get('/categories', expensetrackingController.getAllCategories);

// Transaction routes
router.post('/transactions', expensetrackingController.createTransaction);
router.get('/transactions/:user_id', expensetrackingController.getAllTransactions);

// Budget routes
router.post('/budgets', expensetrackingController.createBudget);
router.get('/budgets/:user_id', expensetrackingController.getAllBudgets);

// Report routes
router.post('/reports', expensetrackingController.createReport);
router.get('/reports/:user_id', expensetrackingController.getAllReports);

module.exports = router;