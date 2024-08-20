const authService = require('../Service/authService');
const authController = {

     LoginUsertopg: async (req, res) => {
        try {
            const userdata = req.body;
            console.log(userdata)
            const result = await authService.LoginUserToPg(userdata);
            if (result.message) {
                res.status(200).json(result)
            } else {
                res.json(result)
            }

        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    },

    LoginUserMongo: async (req, res) => {
        try {
            const userdata = req.body;
            console.log(userdata)
            const result = await authService.LoginUserMongo(userdata);
            if (result.message) {
                res.status(200).json(result)
            } else {
                res.json(result)
            }

        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    }
}


module.exports = authController