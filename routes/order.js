const express = require('express');
const { showOrders } = require('../controllers/order');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

router.get('/user/myorders', isLoggedIn, showOrders);

module.exports = router;