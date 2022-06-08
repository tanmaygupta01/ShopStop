const { v4: uuid } = require('uuid');
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.MERCHANT_ID,
    key_secret: process.env.MERCHANT_SECRET
});


module.exports.createOrder = (req, res) => {
    const options = {
        amount: req.body.amount,
        currency: "INR",
    }
    razorpay.orders.create(options, (err,order) => {
        res.json(order);
    });
}

module.exports.cartPayment = (req,res) => {
    razorpay.payments.fetch(req.body.razorpay_payment_id)
    .then(async(paymentDocument) => {

        if(paymentDocument.status === 'authorized'){

            const { amount } = paymentDocument;
            const order = new Order({ txnId: uuid(), txnAmt: amount/100 });

            const user = await User.findById(req.user._id).populate({
                path: 'cart',
                populate: {
                    path: 'product'
                }
            });
            const orderedProducts = user.cart.map((item) => {
                const obj = {
                    productName: item.product.name,
                    productImage: item.product.image,
                    quantity: item.quantity,
                    productId: item.product._id
                }
                return obj;
            });

            order.orderedProducts = [...orderedProducts];
            await order.save();

            user.orders.push(order);
            user.cart.splice(0);
            user.totalCartProducts = 0;
            req.user = await user.save();
         
            req.flash('success','Successfully placed your order!! Thank you for shopping :)');
            res.redirect('/user/myorders');

        }
        else{
            req.flash('error',"Oops! Can't place your order at the moment, please try after some time.");
            res.redirect('/user/cart');
        }

    })
    .catch((e) => {
        req.flash('error',"Oops! Can't place your order at the moment, please try after some time.");
        res.redirect('/user/cart');
    });

}

module.exports.directPayment =  (req,res) => {
    razorpay.payments.fetch(req.body.razorpay_payment_id)
    .then(async(paymentDocument) => {

        if(paymentDocument.status === 'authorized'){

            const { amount, description } = paymentDocument;
            const order = new Order({ txnId: uuid(), txnAmt: amount/100 });

            const product = await Product.findOne({ name: description });

            const orderedProduct = {
                productName: product.name,
                productImage: product.image,
                quantity: 1,
                productId: product._id
            }

            order.orderedProducts.push(orderedProduct);
            await order.save();

            req.user = await User.findByIdAndUpdate(req.user._id,{ $addToSet: { orders: order } },{ new: true });

            req.flash('success','Successfully placed your order!! Thank you for shopping :)');
            res.redirect('/user/myorders');

        }
        else{
            const product = await Product.findOne({ name: paymentDocument.description });

            req.flash('error',"Oops! Can't place your order at the moment, please try after some time.");
            res.redirect(`/products/${product._id}`);
        }

    })
    .catch((e) => {
        res.render('error',{ err: "Oops! Can't place your order at the moment, please try after some time." });
    });

}