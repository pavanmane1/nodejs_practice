const express = require("express")
const router = express.Router();
const userController = require("../Controller/controller");

router.get("/users", userController.getAllUsers)
router.get("/mongousers", userController.getAllMongoUsers)
router.get("/users/:id", userController.getUserById)
router.post("/user", userController.createNewUser)
router.post("/mongouser", userController.createNewUserToMongo)
router.get("/mongousers/:id", userController.getMongoUserById)
module.exports = router;