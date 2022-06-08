const mongoose = require('mongoose');
const Order = require('./order');
const Review = require('./review');
const User = require('./user');


const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true
    },
    category: String,
    name: {
        type: String,
        trim: true,
        required: true
    },
    desc: {
        type: String,
        trim: true,
        required: true
    },
    newPrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: {
        type: Number,
        default: 0
    }
});

productSchema.post('findOneAndDelete',async(product) => {

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

});




const Product = mongoose.model('Product',productSchema);


module.exports = Product;
