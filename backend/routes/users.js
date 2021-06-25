var express = require('express');
const userController = require("../controllers/user");
var router = express.Router();
const UserController2 = require("../controllers/user2-clean-code")
const { verifyUser, verifyAdmin } = require("../validator/verify-token")
const categoriesController = require("../controllers/category")
const product = require("../controllers/product")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
     cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
     cb(null, `${Date.now()}-${file.originalname}`);
    },
   });
   const upload = multer({
    storage: storage,
   });

router.post("/register", userController.register)
router.post("/register2", UserController2.signUp)
router.post("/login", userController.userLogin)
router.post("/login2", UserController2.login)
router.get("/show", userController.getAllData);
router.get("/data", verifyUser, UserController2.data);
router.get("/category", categoriesController.getCategories);
router.post("/create-category", categoriesController.create);
router.get("/product", product.getProduct);
router.post("/create-product", upload.single('image'), product.createProduct);
module.exports = router;