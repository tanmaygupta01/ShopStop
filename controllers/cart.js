const mongoose = require('mongoose');
const User = require('../models/user');


module.exports.showCart = async(req,res) => {

    const user = await User.findById(req.user._id).populate({
        path: 'cart',
        populate: {
            path: 'product'
        }
    })

    const totalAmount = user.cart.reduce((prev,curr) => prev + (curr.product.newPrice * curr.quantity),0);
    const productInfo = user.cart.map((curr) => curr.product.name).join(', ');

    res.render('./cart/cart', { cartProducts: user.cart, totalAmount, productInfo });

}

module.exports.addProductToCart = async(req,res) => {
    const { productid } = req.params;
    const productId = mongoose.Types.ObjectId(productid);

    const isPackPresent = req.user.cart.filter(item => item.product._id.equals(productId));

    if(isPackPresent.length){
        req.user = await User.findOneAndUpdate({ _id: req.user._id, "cart.product": productId },
                                        { $inc: { "cart.$.quantity": 1, totalCartProducts: 1 } },
                                        { new: true});
        return res.redirect('/user/cart');
    }

    const newPack = {
        product: productId,
        quantity: 1
    }
    req.user = await User.findByIdAndUpdate(req.user._id,{ $addToSet: { cart: newPack},
                                                         $inc: { totalCartProducts: 1 } },
                                                         { new: true });
    
    res.redirect('/user/cart');

}

module.exports.deleteProductFromCart = async(req,res) => {
    const { productid } = req.params;

    const productId = mongoose.Types.ObjectId(productid);

    req.user = await User.findByIdAndUpdate(req.user._id,{ $pull: { cart: { product: productId } } },{ new: true });
    
    const netQuantity = req.user.cart.reduce((prev,curr) => prev + curr.quantity,0);

    req.user = await User.findByIdAndUpdate(req.user._id,{ totalCartProducts: netQuantity });
    res.redirect('/user/cart');

}

