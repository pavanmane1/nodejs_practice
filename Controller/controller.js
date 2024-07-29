const userService = require('../Service/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getUSers();
        if (users.message) {
            res.status(200).json(users)
        } else {
            res.json(users)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const result = await userService.getUserById(id);
        if (result.message) {
            res.status(200).json(users)
        } else {
            res.json(result)
        }

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}
const createNewUser = async (req, res) => {
    try {
        const userdata = req.body;
        const newUser = await userService.createUser(userdata);
        res.status(201).json({
            message: "Data saved successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const userdata = req.body;
        const id = req.params.id; // fixed the variable to access id correctly
        const newUser = await userService.updateUser(userdata, id);
        res.status(200).json({
            message: "Data updated successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createNewUserToMongo = async (req, res) => {
    try {
        const userdata = req.body;
        const newUser = await userService.createUserMongo(userdata);
        res.status(201).json({
            message: "Data saved successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
};


const getAllMongoUsers = async (req, res) => {
    try {
        const users = await userService.getMongoUsers();
        if (users.message) {
            res.status(200).json(users)
        } else {
            res.json(users)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMongoUserById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const result = await userService.getMongoUsersbyId(id);
        if (result.message) {
            res.status(200).json(users)
        } else {
            res.json(result)
        }

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}
module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    createNewUserToMongo,
    getAllMongoUsers,
    getMongoUserById,
    updateUser
};
