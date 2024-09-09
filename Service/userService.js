const connection = require('../config/dbconnect');
const User = require('../Model/userModel');
const UserRoles = require('../Model/userRoleModel');
const MongoUser = require('../Model/usermongoSchema');
const Designation = require('../Model/designationmodel')
const { connectToMongo, databaseName, collectionName, secretkey } = require('../config/mongoconnect');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi')


const getUSers = async () => {
    try {
        const users = await connection.query('SELECT * FROM data.users');
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

const getUserRoles = async () => {
    try {
        const users = await connection.query('SELECT * FROM public.acl_role');
        if (users.rows.length == 0) {
            return { message: "No user found " };

        }
        console.log(users.rows[0])
        const userRoles = users.rows.map(row => new UserRoles(row.id, row.createdby, row.rolename, row.caption));
        return userRoles;

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
        const userById = await connection.query('SELECT * FROM data.users WHERE id = $1', [id]);
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
        const { id, username, email, phone } = data;

        const result = await connection.query(
            'INSERT INTO data.users(id, username, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, username, email, phone]
        );
        const newUser = result.rows[0];
        return new User(newUser.id, newUser.name, newUser.email, newUser.phone);
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const createUserServerdb = async (data) => {
    try {
        const uuid = uuidv4();
        const { username, password, mobile, roleid, } = data;
        const passwordwitsecretkey = password + secretkey;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(passwordwitsecretkey, salt);
        const result = await connection.query(
            'INSERT INTO public.users(id, username, password, mobile ) VALUES ($1, $2, $3,$4 ) RETURNING *',
            [uuid, username, hashPassword, mobile]
        );

        const userId = result.rows[0].id;
        const userrole = await connection.query(
            'INSERT INTO public.acl_user_role(user_id, role_id ) VALUES ($1, $2 ) RETURNING *',
            [userId, roleid]
        );
        const userroledata = userrole.rows[0];
        console.log(userroledata)
        const newUser = result.rows[0];
        return new User(newUser.username, newUser.password, newUser.roleid);
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const updateUser = async (data, id) => {
    try {

        const { name, email, phone } = data;
        const result = await connection.query(
            'UPDATE data.users SET name = $1, email = $2, phone = $3 WHERE id = $4',
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


const validateUserMongo = async (data, headers) => {
    let dbClient;
    try {
        // Connect to MongoDB
        dbClient = await connectToMongo();
        const database = dbClient.db(databaseName);
        const collection = database.collection("users");

        const { username, password } = data;

        // Extract token from the Authorization header
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { isAuthenticated: false, message: 'Authorization header is missing or malformed' };
        }
        const token = authHeader.split(' ')[1]; // Get the token part

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, secretkey);
        } catch (error) {
            return { isAuthenticated: false, message: 'Invalid or expired token' };
        }

        // Find the user by username
        const user = await collection.findOne({ username: username });
        if (!user) {
            return { isAuthenticated: false, message: 'User not found' };
        }

        // Verify the password provided
        const passwordWithSecretKey = password + secretkey;
        const isPasswordMatch = await bcrypt.compare(passwordWithSecretKey, user.password);
        if (!isPasswordMatch) {
            return { isAuthenticated: false, message: 'Invalid credentials' };
        }

        // Ensure the password in the token matches the user's password
        const tokenPasswordWithSecretKey = password + secretkey;
        const isTokenPasswordMatch = await bcrypt.compare(tokenPasswordWithSecretKey, user.password);
        if (!isTokenPasswordMatch) {
            return { isAuthenticated: false, message: 'Token password does not match the user' };
        }

        // If all checks pass
        return { isAuthenticated: true, message: 'User validated successfully' };
    } catch (error) {
        throw new Error(`Error validating user: ${error.message}`);
    } finally {
        // Ensure the database client is closed after the operation
        if (dbClient) {
            await dbClient.close();
        }
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

const createNewEmployeeDetails = async (data) => {
    // Define the schema for validation
    const schema = Joi.object({
        id: Joi.string().optional(),
        employee_id: Joi.string().required(),
        section_code: Joi.string().required(),
        designation: Joi.string().required(),
        honorific_code: Joi.string().optional(),
        namelast: Joi.string().required(),
        namefirst: Joi.string().required(),
        namemiddle: Joi.string().optional(),
        name: Joi.string().optional(),
        education: Joi.string().optional(),
        address1: Joi.string().required(),
        address2: Joi.string().optional(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pin: Joi.string().required(),
        phonenumber: Joi.string().required(),
        permanentaddress1: Joi.string().optional(),
        permanentaddress2: Joi.string().optional(),
        permanentcity: Joi.string().optional(),
        permanentstate: Joi.string().optional(),
        dateofleaving: Joi.string().allow(null, '').optional(),
        dateofjoining: Joi.date().required(),
        initials: Joi.string().optional(),
        employeetype_code: Joi.string().required(),
        paytype_code: Joi.string().required(),
        epf_number: Joi.string().optional(),
        ppf_number: Joi.string().optional(),
        pan_number: Joi.string().optional(),
        email_id: Joi.string().email().required(),
        pl: Joi.number().optional(),
        cl: Joi.number().optional(),
        ml: Joi.number().optional(),
        isclosed: Joi.boolean().optional(),
        isdeleted: Joi.boolean().optional(),
        pettycashaccount_id: Joi.string().optional(),
    });

    const { error } = schema.validate(data);
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }

    // Create a new client instance and connect to the database

    await connection.connect();

    try {
        // Start a transaction
        await connection.query('BEGIN');

        // Extract keys and values from data object
        const keys = Object.keys(data);
        const values = Object.values(data);

        // Generate the placeholders dynamically
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        // Create the dynamic query
        const query = `
            INSERT INTO public.employee (${keys.join(', ')})
            VALUES (${placeholders})
            RETURNING id, namefirst, namelast, email_id, phonenumber;
        `;

        // Execute the query
        const result = await connection.query(query, values);

        // Commit the transaction
        await connection.query('COMMIT');

        const newUser = result.rows[0];
        return {
            id: newUser.id,
            name: `${newUser.namefirst} ${newUser.namelast}`,
            email: newUser.email_id,
            phone: newUser.phonenumber
        };
    } catch (error) {
        // Rollback in case of an error
        await connection.query('ROLLBACK');
        console.error(`Error creating user: ${error.message}`);
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const getUserDesignation = async () => {
    try {
        const users = await connection.query('SELECT * FROM public.designation');
        if (users.rows.length == 0) {
            return { message: "No user found " };

        }

        const userRoles = users.rows.map(row => new Designation(row.designation_id, row.designation_name, row.description));
        return userRoles;

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
const getEmployeeeDetails = async () => {
    try {
        const employees = await connection.query('SELECT id , name FROM public.employee');
        if (employees.rows.length == 0) {
            return { message: "No employee found " };

        }
        // console.log(users.rows)
        // const userRoles = users.rows.map(row => new Designation(row.designation_id, row.designation_name, row.description));
        return employees.rows;

    } catch (error) {
        throw new Error(`Error  fetching employees data : ${error.message}`)
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
module.exports = {
    getUSers,
    getUserById,
    createUser,
    createUserMongo,
    getMongoUsers,
    getMongoUsersbyId,
    updateUser,
    registerNewUserMongo,
    validateUserMongo,
    createUserServerdb,
    getUserRoles,
    createNewEmployeeDetails,
    getUserDesignation,
    getEmployeeeDetails
};
