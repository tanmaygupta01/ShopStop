const express = require('express');
const router = express.Router();
const { validateProduct, isLoggedIn, isSeller, isProductAuthor } = require('../middlewares');
const { showAllProducts, productForm, createProduct, showProduct, buyNow, editForm, updateProduct, deleteProduct } = require('../controllers/product');



const parser = express.urlencoded({extended:true});

router.route('/')
        .get(showAllProducts)
        .post(parser, validateProduct, createProduct);
router.get('/new', isLoggedIn, isSeller, productForm);

router.route('/:productid')
        .get(showProduct)
        .patch(parser, validateProduct, updateProduct)
        .delete(parser, isLoggedIn, isSeller, isProductAuthor, deleteProduct);


router.get('/:productid/Buynow', isLoggedIn, buyNow);
router.get('/:productid/edit', isLoggedIn, isSeller, isProductAuthor, editForm);

module.exports = router;