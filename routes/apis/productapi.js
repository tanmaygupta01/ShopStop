const express = require('express');
const { isLoggedIn } = require('../../middlewares');
const User = require('../../models/user');
const router = express.Router();


const parser = express.urlencoded({extended:true});

router.post('/products/:productid/like', parser, isLoggedIn, async(req,res) => {
    const { productid } = req.params;

    const user = req.user;
    const isLiked = user.wishList.includes(productid);
    const option = isLiked ? '$pull' : '$addToSet';
    req.user = await User.findByIdAndUpdate(req.user._id,{ [option]: { wishList: productid } },{ new: true });

    res.send(req.user);

});







module.exports = router;