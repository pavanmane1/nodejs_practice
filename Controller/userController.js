const { userService } = require('../Service/services');

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

const getUserRoles = async (req, res) => {
    try {
        const usersroles = await userService.getUserRoles();
        if (usersroles.message) {
            res.status(200).json(usersroles)
        } else {
            res.json(usersroles)
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

const createNewUsertoServerdb = async (req, res) => {
    try {
        const userdata = req.body;
        const newUser = await userService.createUserServerdb(userdata);
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

const registerNewUser = async (req, res) => {
    try {
        const userdata = req.body;
        const newUser = await userService.registerNewUserMongo(userdata);
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



const validatedUserMongo = async (req, res) => {
    try {
        const userdata = req.body;
        const headers = req.headers;

        console.log(userdata);

        // Pass both userdata and headers to the validation function
        const result = await userService.validateUserMongo(userdata, headers);

        if (result.message) {
            res.status(200).json(result);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getUserDesignations = async (req, res) => {
    try {
        const usersroles = await userService.getUserDesignation();
        if (usersroles.message) {
            res.status(200).json(usersroles)
        } else {
            res.json(usersroles)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const registerNewEmployee = async (req, res) => {
    try {
        const userdata = req.body;
        const newUser = await userService.createNewEmployeeDetails(userdata);
        res.status(201).json({
            message: "Data saved successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmployeeeDetails = async (req, res) => {
    try {
        const employeeDetails = await userService.getEmployeeeDetails();
        if (employeeDetails.message) {
            res.status(200).json(employeeDetails)
        } else {
            res.json(employeeDetails)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    createNewUserToMongo,
    getAllMongoUsers,
    getMongoUserById,
    updateUser,
    registerNewUser,
    validatedUserMongo,
    createNewUsertoServerdb,
    getUserRoles,
    getUserDesignations,
    registerNewEmployee,
    getEmployeeeDetails
};
