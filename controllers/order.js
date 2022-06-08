const User = require('../models/user');


module.exports.showOrders = async(req,res) => {

    const user = await User.findById(req.user._id).populate('orders');

    res.render('./orders/myorders', { orders: user.orders });

}