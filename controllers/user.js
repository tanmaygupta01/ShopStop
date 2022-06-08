const User = require('../models/user');


module.exports.deleteUser = async(req,res) => {

    const userId = req.user._id;
    req.logOut();
    await User.findByIdAndDelete(userId);
    req.flash('success','Account has been deleted successfully!!');
    res.redirect('/products');

}