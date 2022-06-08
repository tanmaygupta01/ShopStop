const express = require('express');
const router = express.Router();
const { validateReview, isLoggedIn, canDelete } = require('../middlewares');
const { createReview, deleteReview } = require('../controllers/review');


const parser = express.urlencoded({extended:true});

router.post('/products/:productid/reviews', parser, isLoggedIn, validateReview, createReview);

router.delete('/products/:productid/reviews/:reviewid', parser, isLoggedIn, canDelete, deleteReview);


module.exports = router;

