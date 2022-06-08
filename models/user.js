const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Order = require('./order');
const Product = require('./product');
const Review = require('./review');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ],
    totalCartProducts: {
        type: Number,
        default: 0
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);


userSchema.post('findOneAndDelete', async(user) => {
 
    //delete all the orders of the user
    if(user.orders.length){
        await Order.deleteMany({ _id: { $in: user.orders } });
    }

    //delete all the products published by the user
    const products = await Product.find({ author: user._id });

    for(let product of products){
        // delete the user's product
        await Product.deleteOne(product);
        
        //deleting reviews of the product
        if(product.reviews.length>0){
            await Review.deleteMany({ _id: { $in: product.reviews } });
        }

        //deleting the product from cart of all the users
        //and removing the product from the wishlist of all the users
        await User.updateMany({},{ $pull: { cart: { product: product._id }, wishList: product._id } });
        const users = await User.find();
        for(let user of users){
            user.totalCartProducts = user.cart.reduce((prev,curr) => prev + curr.quantity,0);
            await user.save();
        }

        //configuring the my orders section of all the users
        //if that product has been ordered in the past    
        await Order.updateMany({ 'orderedProducts.productId': product._id },
                                { $set: { 'orderedProducts.$.productExist': false } });
                                
    }

    //delete all the reviews published by the user
    await Review.deleteMany({ reviewAuthor: user._id });
    
})


const User = mongoose.model('User',userSchema);

module.exports = User;
