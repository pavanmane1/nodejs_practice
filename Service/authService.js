const connection = require('../config/dbconnect');
const User = require('../Model/userModel');
const MongoUser = require('../Model/usermongoSchema');
const { connectToMongo, databaseName, collectionName, secretkey } = require('../config/mongoconnect');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");

const authService = {

    LoginUserMongo: async (data) => {
        try {

            const dbClient = await connectToMongo();
            const database = dbClient.db(databaseName);
            const collection = database.collection("users");
            const { username, password } = data;
            const user = await collection.findOne({ username: username });

            if (!user) {
                return { loginstatus: false, message: 'User not found' };
            }

            // Combine the password with the secret key before comparing
            const passwordWithSecretKey = password + secretkey;

            // Compare the combined password and secret key with the stored hash
            const isMatch = await bcrypt.compare(passwordWithSecretKey, user.password);

            if (!isMatch) {
                return { loginstatus: false, message: 'Invalid credentials' };
            } else {
                // Generate a JWT token if the password is correct
                const token = jwt.sign({ id: user._id }, secretkey, { expiresIn: '1h' });
                return { loginstatus: true, message: 'Login successful', token };
            }
        } catch (error) {
            throw new Error(`Error fetching user data: ${error.message}`);
        }
    },

    LoginUserToPg: async (data) => {
        try {

            const { username, password } = data;
            const user = await connection.query('SELECT * FROM public.users WHERE username = $1', [username]);
            if (user.rows.length == 0) {
                return { message: `no user found by : ${id}` }
            }

            // Combine the password with the secret key before comparing
            const passwordWithSecretKey = password + secretkey;

            // Compare the combined password and secret key with the stored hash
            const isMatch = await bcrypt.compare(passwordWithSecretKey, user.rows[0].password);

            if (!isMatch) {
                return { loginstatus: false, message: 'Invalid credentials' };
            } else {
                // Generate a JWT token if the password is correct
                const token = jwt.sign({ id: user._id }, secretkey, { expiresIn: '5m' });
                return { loginstatus: true, message: 'Login successful', token };
            }
        } catch (error) {
            throw new Error(`Error fetching user data: ${error.message}`);
        }
    }
}
module.exports = authService