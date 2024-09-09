
const productService = require('../Service/productServices');
const productController = {

    createNewCatagory: async (req, res) => {
        try {
            const userdata = req.body;
            console.log(userdata)
            const result = await productService.createNewCatagory(userdata);
            if (result.message) {
                res.status(200).json(result)
            } else {
                res.json(result)
            }

        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    },

    getCategories: async (req, res) => {
        try {
            const usersroles = await productService.getAllCatagory();
            if (usersroles.message) {
                res.status(200).json(usersroles)
            } else {
                res.json(usersroles)
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createNewMasterCatagory: async (req, res) => {
        try {
            const userdata = req.body;
            console.log(userdata)
            const result = await productService.createNewMasterCatagory(userdata);
            if (result.message) {
                res.status(200).json(result)
            } else {
                res.json(result)
            }

        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    },

    getMasterCategories: async (req, res) => {
        try {
            const usersroles = await productService.getAllMasterCatagory();
            if (usersroles.message) {
                res.status(200).json(usersroles)
            } else {
                res.json(usersroles)
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = productController