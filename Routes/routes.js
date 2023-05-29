const express = require('express');
const router = express.Router();
const UserController = require("../Controllers/UserControllers.js");
const ProductController = require("../Controllers/ProductControllers.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/"});

router.post('/add-user-email-password',upload.single('avatar'),  UserController.addUserEmailPassword);
router.post('/login-user-email-password',upload.none(),  UserController.loginUserEmailPassword);
router.post('/add-user-google', UserController.addUserGoogle);
router.get('/get-user/:id', UserController.getUser);


router.post('/add-product',upload.array('images',4) , ProductController.addProduct);
router.get('/get-product/:id', ProductController.getProduct);
router.get('/get-all-products', ProductController.getAllProducts);
router.get('/get-product-by-name/:name', ProductController.getProductByName);
router.get('/get-new-arrivals', ProductController.getNewArrivals);
router.get('/get-most-popular', ProductController.getMostPopular);
router.get('/get-user-products/:id', ProductController.getMyProducts);
router.post('/edit-product/:id',upload.array('images',4), ProductController.saveEditedProduct);
router.post('/delete-product/:id', ProductController.deleteProduct);

module.exports = router;