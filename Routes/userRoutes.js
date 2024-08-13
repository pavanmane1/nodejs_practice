const express = require("express")
const router = express.Router();
const userController = require("../Controller/controller");

router.get("/users", userController.getAllUsers)
router.get("/mongousers", userController.getAllMongoUsers)
router.get("/users/:id", userController.getUserById)
router.post("/user", userController.createNewUser)
router.put("/user/:id", userController.updateUser);
router.post("/mongouser", userController.createNewUserToMongo)
router.post("/newuser", userController.registerNewUser)
router.post("/login", userController.LoginUserMongo)
router.get("/mongousers/:id", userController.getMongoUserById)
module.exports = router;