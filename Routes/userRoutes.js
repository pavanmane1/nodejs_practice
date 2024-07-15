const express = require("express")
const router = express.Router();
const userController = require("../Controller/controller");

router.get("/users", userController.getAllUsers)
router.get("/users/:id", userController.getUserById)
router.post("/user", userController.createNewUser)
router.post("/mongouser", userController.createNewUserToMongo)

module.exports = router;