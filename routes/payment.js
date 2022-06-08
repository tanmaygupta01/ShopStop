const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { createOrder, directPayment, cartPayment } = require('../controllers/payment');

const parser1 = express.urlencoded({extended: false});
const parser2 = express.json();

router.post('/order', isLoggedIn, parser2, createOrder);
router.post('/is-order-complete', isLoggedIn, parser1, cartPayment );
router.post('/is-order-complete-buynow', isLoggedIn, parser1, directPayment);

module.exports = router;