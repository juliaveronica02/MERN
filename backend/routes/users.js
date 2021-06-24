var express = require('express');
const userController = require("../controllers/user");
var router = express.Router();
const UserController2 = require("../controllers/user2-clean-code")
const { verifyUser, verifyAdmin } = require("../validator/verify-token")

router.post("/register", userController.register)
router.post("/register2", UserController2.signUp)
router.post("/login", userController.userLogin)
router.post("/login2", UserController2.login)
router.get("/show", userController.getAllData);
router.get("/data", verifyUser, UserController2.data);

module.exports = router;