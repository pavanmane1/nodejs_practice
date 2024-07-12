const userService = require('../Service/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getUSers();
        res.json(users.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const result = await userService.getUserById(id);
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

module.exports = {
    getAllUsers,
    getUserById
};
