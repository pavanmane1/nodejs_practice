const connection = require('../config/dbconnect');
const User = require('../Model/userModel');
const MongoUser = require('../Model/usermongoSchema');
const { connectToMongo, databaseName, collectionName, secretkey } = require('../config/mongoconnect');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const getUSers = async () => {
    try {
        const users = await connection.query('SELECT * FROM hrm.user');
        if (users.rows.length == 0) {
            return { message: "No user found " };

        }
        const allUser = users.rows.map(row => new User(row.id, row.name, row.email, row.phone));
        return allUser;

    } catch (error) {
        throw new Error(`Error  fetching user data : ${error.message}`)
    }

    // return new Promise((resolve, reject) => {
    //     connect.query('SELECT * FROM hrm.user', (error, result) => {
    //         if (error) {
    //             reject(error);
    //         } else {
    //             const allUsers = result.rows.map(rows => new User(rows.id, rows.name, rows.email, rows.phone));
    //             resolve(allUsers);
    //         }
    //     });
    // });
};
const getUserById = async (id) => {
    try {
        const userById = await connection.query('SELECT * FROM hrm.user WHERE id = $1', [id]);
        if (userById.rows.length == 0) {
            return { message: `no user found by : ${id}` }
        }
        const result = new User(userById.rows[0].id, userById.rows[0].name, userById.rows[0].email, userById.rows[0].phone);
        return result;
    } catch (error) {
        throw new Error(`Error fetching user data by id : ${error.message}`)
    }

    // return new Promise((resolve, reject) => {
    //     connect.query('SELECT * FROM hrm.user WHERE id = $1', [id], (error, result) => {
    //         if (error) {
    //             reject(error);
    //         } else {
    //             const users = result.rows.length ? new User(result.rows[0].id, result.rows[0].name, result.rows[0].email, result.rows[0].phone) : null;
    //             resolve(users);
    //         }
    //     });
    // });
};
const createUser = async (data) => {
    try {
        const { id, name, email, phone } = data;

        const result = await connection.query(
            'INSERT INTO hrm.user(id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, name, email, phone]
        );
        const newUser = result.rows[0];
        return new User(newUser.id, newUser.name, newUser.email, newUser.phone);
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};


const updateUser = async (data, id) => {
    try {
        const { name, email, phone } = data;
        const result = await connection.query(
            'UPDATE hrm.user SET name = $1, email = $2, phone = $3 WHERE id = $4',
            [name, email, phone, id]
        );
        if (result.rowCount === 0) {
            throw new Error('No user found with the given id');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

const createUserMongo = async (data) => {
    let dbClient;
    try {
        dbClient = await connectToMongo();
        const database = dbClient.db(databaseName);
        const collection = database.collection(collectionName);
        const { id, name, email, phone } = data;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash()
        })





        // const newUser = { id, name, email, phone };
        // const result = await collection.insertOne(newUser);
        // console.log(`User ${name} inserted successfully. Inserted Id: ${result.insertedId}`);

        return; // Return the result if needed
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const registerNewUserMongo = async (data) => {
    let dbClient;
    try {
        // Connect to MongoDB
        dbClient = await connectToMongo();
        const database = dbClient.db(databaseName);
        const collection = database.collection("users");

        // Extract username and password from the data
        const { username, password } = data;
        const passwordwitsecretkey = password + secretkey;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(passwordwitsecretkey, salt);
        const newUser = { username, password: hash };
        const result = await collection.insertOne(newUser);
        console.log(`User ${username} inserted successfully. Inserted Id: ${result.insertedId}`);

        return result;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    } finally {
        // Ensure the database client is closed after the operation
        if (dbClient) {
            await dbClient.close();
        }
    }
};

const getMongoUsers = async () => {
    try {
        const dbClient = await connectToMongo();
        const database = dbClient.db(databaseName);
        const collection = database.collection(collectionName);

        const users = await collection.find().toArray();
        if (users.length === 0) {
            return { message: "No user found" };
        }

        const allUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone0
        }));

        return allUsers;
    } catch (error) {
        throw new Error(`Error fetching user data: ${error.message}`);
    }
};

const LoginUserMongo = async (data) => {
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
};

const getMongoUsersbyId = async (id) => {
    try {
        const dbClient = await connectToMongo();
        const database = dbClient.db(databaseName);
        const collection = database.collection(collectionName);

        const userById = await collection.findOne({ id: id });
        if (userById.length === 0) {
            return { message: "No user found" };
        }
        const users = new User(userById.id, userById.name, userById.email, userById.phone);

        return users;
    } catch (error) {
        throw new Error(`Error fetching user data: ${error.message}`);
    }
};

module.exports = {
    getUSers,
    getUserById,
    createUser,
    createUserMongo,
    getMongoUsers,
    getMongoUsersbyId,
    updateUser,
    registerNewUserMongo,
    LoginUserMongo
};
