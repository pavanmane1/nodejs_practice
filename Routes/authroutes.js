const express = require("express")
const router = express.Router();
const { authController } = require("../Controller/controllers");

router.post("/userlogin", authController.LoginUsertopg)
router.post("/login", authController.LoginUserMongo)

module.exports = router;