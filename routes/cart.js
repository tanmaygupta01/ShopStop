const express = require('express');
const { showCart, addProductToCart, deleteProductFromCart } = require('../controllers/cart');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();

const parser = express.urlencoded({extended:true});

router.get('/user/cart', isLoggedIn, showCart);
router.post('/user/:productid/add', parser, isLoggedIn, addProductToCart);
router.delete('/user/:productid/delete', parser, isLoggedIn, deleteProductFromCart);


module.exports = router;