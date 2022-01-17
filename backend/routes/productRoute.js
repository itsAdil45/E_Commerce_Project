const express = require("express");
const { getAllProducts , createProduct, updateProduct,deleteProduct,getProductDetails} = require("../../controllers/productController");

const router = express.Router();


//get products
router.route('/products').get(getAllProducts);
//for admin
router.route('/product/new').post(createProduct);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteProduct);
router.route('/product/:id').get(getProductDetails);


module.exports = router;

