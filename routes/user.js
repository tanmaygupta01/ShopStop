const express = require('express');
const { deleteUser } = require('../controllers/user');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');



router.delete('/user/delete', isLoggedIn, deleteUser);


module.exports = router;

