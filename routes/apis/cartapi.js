const express = require('express');
const mongoose = require('mongoose');
const { isLoggedIn } = require('../../middlewares');
const User = require('../../models/user');
const router = express.Router();

const parser = express.urlencoded({extended:true});

router.post('/user/:productid/increase', parser, isLoggedIn, async(req,res) => {
    const { productid } = req.params;

    const productId = mongoose.Types.ObjectId(productid);

    req.user = await User.findOneAndUpdate({ _id: req.user._id, 'cart.product': productId },
                                            { $inc: { 'cart.$.quantity': 1, totalCartProducts: 1 } },
                                            { new: true }).populate({
                                                path:'cart',
                                                populate:{
                                                    path: 'product'
                                                }
                                            });

    const packs = req.user.cart.filter(item => item.product._id.equals(productId));
    const totalAmount = req.user.cart.reduce((prev,curr) => prev + (curr.product.newPrice * curr.quantity),0);

    res.send({ quantity: packs[0].quantity, totalCartProducts: req.user.totalCartProducts, totalAmount })
    
});

router.post('/user/:productid/decrease', parser, isLoggedIn, async(req,res) => {
    const { productid } = req.params;

    const productId = mongoose.Types.ObjectId(productid);

    req.user = await User.findOneAndUpdate({ _id: req.user._id, 'cart.product': productId },
                                            { $inc: { 'cart.$.quantity': -1, totalCartProducts: -1 } },
                                            { new: true }).populate({
                                                path: 'cart',
                                                populate: {
                                                    path: 'product'
                                                }
                                            });
    
    const packs = req.user.cart.filter(item => item.product._id.equals(productId));

    if(packs[0].quantity === 0){
        req.user = await User.findByIdAndUpdate(req.user._id,
                                                { $pull: { cart: { product: productId } } },
                                                { new: true }).populate({
                                                    path: 'cart',
                                                    populate: {
                                                        path: 'product'
                                                    }
                                                });
    }

    const totalAmount = req.user.cart.reduce((prev,curr) => prev + (curr.product.newPrice * curr.quantity),0);
    const productInfo = req.user.cart.map((curr) => curr.product.name).join(', ');

    res.send({ quantity: packs[0].quantity, totalCartProducts: req.user.totalCartProducts, totalAmount, productInfo });
    
});


module.exports = router;