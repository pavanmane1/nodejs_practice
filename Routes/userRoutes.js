const express = require("express")
const router = express.Router();
const { userController } = require("../Controller/controllers");

router.get("/users", userController.getAllUsers)
router.get("/mongousers", userController.getAllMongoUsers)
router.get("/users/:id", userController.getUserById)
router.post("/user", userController.createNewUser)
router.put("/user/:id", userController.updateUser);
router.post("/mongouser", userController.createNewUserToMongo)
router.post("/newuser", userController.registerNewUser)
router.post("/validatelogin", userController.validatedUserMongo)
router.get("/mongousers/:id", userController.getMongoUserById)
//server database api call routes
router.post("/createuser", userController.createNewUsertoServerdb)
router.get("/getuserrole", userController.getUserRoles)
router.get("/designation", userController.getUserDesignations)
router.post("/registeremployee", userController.registerNewEmployee)
router.get("/employee", userController.getEmployeeeDetails)
module.exports = router;