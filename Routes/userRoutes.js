const express = require("express")
const router = express.Router();
const userController = require("../Controller/controller");

router.get("/users", userController.getAllUsers)
router.get("/users/:id", userController.getUserById)

module.exports = router;