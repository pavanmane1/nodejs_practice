
const expensetrackingServices = require('../Service/expensetrackingServices');
const expensetrackingController = {
    // Create a new user
    createUser: async (req, res) => {
        try {
            const userdata = req.body;
            const result = await expensetrackingServices.createUser(userdata);
            res.status(201).json(result);  // Return created user with status 201
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await expensetrackingServices.getAllUsers();
            res.status(200).json(users);  // Return all users with status 200
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new category
    createCategory: async (req, res) => {
        try {
            const categoryData = req.body;
            const result = await expensetrackingServices.createCategory(categoryData);
            res.status(201).json(result);  // Return created category with status 201
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all categories
    getAllCategories: async (req, res) => {
        try {
            const categories = await expensetrackingServices.getAllCategories();
            res.status(200).json(categories);  // Return all categories with status 200
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new transaction
    createTransaction: async (req, res) => {
        try {
            const transactionData = req.body;
            const result = await expensetrackingServices.createTransaction(transactionData);
            res.status(201).json(result);  // Return created transaction with status 201
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all transactions for a user
    getAllTransactions: async (req, res) => {
        const user_id = req.params.user_id;  // Assuming user_id is passed as a URL parameter
        try {
            const transactions = await expensetrackingServices.getAllTransactions(user_id);
            res.status(200).json(transactions);  // Return all transactions for the user with status 200
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new budget
    createBudget: async (req, res) => {
        try {
            const budgetData = req.body;
            const result = await expensetrackingServices.createBudget(budgetData);
            res.status(201).json(result);  // Return created budget with status 201
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all budgets for a user
    getAllBudgets: async (req, res) => {
        const user_id = req.params.user_id;  // Assuming user_id is passed as a URL parameter
        try {
            const budgets = await expensetrackingServices.getAllBudgets(user_id);
            res.status(200).json(budgets);  // Return all budgets for the user with status 200
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new report
    createReport: async (req, res) => {
        try {
            const reportData = req.body;
            const result = await expensetrackingServices.createReport(reportData);
            res.status(201).json(result);  // Return created report with status 201
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all reports for a user
    getAllReports: async (req, res) => {
        const user_id = req.params.user_id;  // Assuming user_id is passed as a URL parameter
        try {
            const reports = await expensetrackingServices.getAllReports(user_id);
            res.status(200).json(reports);  // Return all reports for the user with status 200
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};


module.exports = expensetrackingController