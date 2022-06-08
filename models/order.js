const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    txnId: String,
    txnAmt: String,
    orderedProducts: [
        {
            productName: String,
            productImage: String,
            quantity: Number,
            productExist: {
                type: Boolean,
                default: true
            },
            productId: mongoose.Schema.Types.ObjectId
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

const Order = mongoose.model('Order',orderSchema);

module.exports = Order;