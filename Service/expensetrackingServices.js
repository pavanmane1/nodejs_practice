const connection = require('../config/dbconnect');
const User = require('../Model/userModel');
const UserRoles = require('../Model/userRoleModel');
const MongoUser = require('../Model/usermongoSchema');
const Designation = require('../Model/designationmodel')
const { connectToMongo, databaseName, collectionName, secretkey } = require('../config/mongoconnect');
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken');

const expensetrackingService = {

    createUserServerdb: async (data) => {
        try {
            const { username, password, email, firstname, lastname } = data;
            const passwordwitsecretkey = password + secretkey;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(passwordwitsecretkey, salt);
            const result = await connection.query(
                'INSERT INTO public.expense_tracking_users (username, password, email , firstname, lastname) VALUES ($1, $2, $3 ,$4,$5) RETURNING *',
                [username, hashPassword, email, firstname, lastname]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    },

    LoginUserToPg: async (data) => {
        try {
            const { username, password } = data;

            // Query to find user by username
            const user = await connection.query('SELECT * FROM public.expense_tracking_users WHERE username = $1', [username]);

            // Check if the user exists
            if (user.rows.length == 0) {
                return { message: `No user found with username: ${username}` };
            }

            // Combine the password with the secret key before comparing
            const passwordWithSecretKey = password + secretkey;

            // Compare the combined password and secret key with the stored hash
            const isMatch = await bcrypt.compare(passwordWithSecretKey, user.rows[0].password);

            if (!isMatch) {
                return { loginstatus: false, message: 'Invalid credentials' };
            } else {
                // Retrieve the user ID from the database result
                const userId = user.rows[0].user_id;
                const firstname = user.rows[0].firstname;
                // Generate a JWT token, including the user ID in the payload
                const token = jwt.sign({ id: userId }, secretkey, { expiresIn: '30m' });

                // Return the login status, token, and user ID
                return {
                    loginstatus: true,
                    message: 'Login successful',
                    token,
                    userId,
                    firstname // Include the user ID in the response
                };
            }
        } catch (error) {
            throw new Error(`Error fetching user data: ${error.message}`);
        }
    },

    // Create a new user
    createUser: async (data) => {
        try {
            const { username, password, email } = data;
            const result = await connection.query(
                'INSERT INTO public.expense_tracking_users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
                [username, password, email]
            );
            return result.rows[0];  // Return the created user
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            const result = await connection.query('SELECT * FROM public.Users;');
            return result.rows;  // Return all users
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    },

    // Create a new category
    createCategory: async (data) => {
        try {
            const { category_name, type } = data;
            const result = await connection.query(
                'INSERT INTO public.expense_Categories (category_name, type) VALUES ($1, $2) RETURNING *',
                [category_name, type]
            );
            return result.rows[0];  // Return the created category
        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    },

    // Get all categories
    getAllCategories: async () => {
        try {
            const result = await connection.query(`
            SELECT
                ec.category_id,
                ec.category_name,
                et.type_name AS type,
                ec.created_at,
                ec.updated_at
            FROM
                public.expense_categories ec
            LEFT JOIN
                public.expense_types et ON ec.category_id = et.category_id;
        `);

            // Group the results into the desired format
            const categories = {};

            result.rows.forEach(row => {
                const { category_id, category_name, type, created_at, updated_at } = row;

                // Initialize category if it doesn't exist
                if (!categories[category_id]) {
                    categories[category_id] = {
                        category_id,
                        category_name,
                        types: [],
                        created_at,
                        updated_at,
                    };
                }

                // Push the type into the types array
                if (type) {
                    categories[category_id].types.push(type);
                }
            });

            // Convert the categories object to an array
            return Object.values(categories);  // Return all categories in the desired format
        } catch (error) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    },



    // Create a new transaction
    createTransaction: async (data) => {
        try {
            const { user_id, category_id, amount, transaction_date, description, category_type } = data;
            const result = await connection.query(
                'INSERT INTO public.expense_transactions (user_id, category_id, category_type, amount, transaction_date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [user_id, category_id, category_type, amount, transaction_date, description]
            );
            return result.rows[0]; // Return the created transaction
        } catch (error) {
            throw new Error(`Error creating transaction: ${error.message}`);
        }
    },

    // Get all transactions for a user
    getAllTransactions: async (user_id) => {
        try {
            const result = await connection.query(
                'SELECT * FROM public.expense_Transactions WHERE user_id = $1;',
                [user_id]
            );
            return result.rows;  // Return all transactions for the user
        } catch (error) {
            throw new Error(`Error fetching transactions: ${error.message}`);
        }
    },

    // Create a new budget
    createBudget: async (data) => {
        try {
            const { user_id, category_id, budget_amount, start_date, end_date } = data;
            const result = await connection.query(
                'INSERT INTO public.expense_Budgets (user_id, category_id, budget_amount, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [user_id, category_id, budget_amount, start_date, end_date]
            );
            return result.rows[0];  // Return the created budget
        } catch (error) {
            throw new Error(`Error creating budget: ${error.message}`);
        }
    },

    // Get all budgets for a user
    getAllBudgets: async (user_id) => {
        try {
            const result = await connection.query(
                'SELECT * FROM public.expense_Budgets WHERE user_id = $1;',
                [user_id]
            );
            return result.rows;  // Return all budgets for the user
        } catch (error) {
            throw new Error(`Error fetching budgets: ${error.message}`);
        }
    },

    // Create a new report
    createReport: async (data) => {
        try {
            const { user_id, report_type, data: reportData } = data;
            const result = await connection.query(
                'INSERT INTO public.expense_Reports (user_id, report_type, data) VALUES ($1, $2, $3) RETURNING *',
                [user_id, report_type, reportData]
            );
            return result.rows[0];  // Return the created report
        } catch (error) {
            throw new Error(`Error creating report: ${error.message}`);
        }
    },

    // Get all reports for a user
    getAllReports: async (user_id) => {
        try {
            const result = await connection.query(
                'SELECT * FROM public.expense_Reports WHERE user_id = $1;',
                [user_id]
            );
            return result.rows;  // Return all reports for the user
        } catch (error) {
            throw new Error(`Error fetching reports: ${error.message}`);
        }
    }
}


module.exports = expensetrackingService