const { productSchema, reviewSchema } = require('./schemas');
const Product = require('./models/product');
const Review = require('./models/review');
const User = require('./models/user');

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate({...req.body });
    if (error) {
        const msg = error.details.map(err => err.message).join(', ');
        return res.render('error', { err: msg });
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate({...req.body });
    if (error) {
        const msg = error.details.map(err => err.message).join(', ');
        return res.render('error', { err: msg });
    }
    next();
};


module.exports.isLoggedIn = (req, res, next) => {

    if (req.xhr && !req.isAuthenticated()) {
        if (req.session.returnUrl) {
            delete req.session.returnUrl;
        }
        return res.status(401).json({ msg: 'You need to login first!!' });
    }

    if (!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl;
        req.flash('error', 'You need to login first!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isSeller = (req, res, next) => {
    if (!(req.user.role && req.user.role === 'seller')) {
        req.flash('error', "Sorry!! You don't have permissions to do that.");
        return res.redirect('/products');
    }
    next();
}
module.exports.isProductAuthor = async(req, res, next) => {

    const { productid } = req.params;
    const product = await Product.findById(productid);
    if (!(product.author && product.author.equals(req.user._id))) {
        req.flash('error', "Sorry!! You don't have permissions to do that because this product doesn't belongs to you.");
        return res.redirect(`/products/${productid}`);
    }
    next();
}
module.exports.canDelete = async(req, res, next) => {
    const { reviewid, productid } = req.params;
    const review = await Review.findById(reviewid);
    const product = await Product.findById(productid);

    if (!product.author.equals(req.user._id)) {
        if (!review.reviewAuthor.equals(req.user._id)) {
            req.flash('error', "Sorry!! You don't have permissions to delete that review.");
            let redirectUrl = req.originalUrl;
            redirectUrl = redirectUrl.split('/');
            redirectUrl = redirectUrl.slice(0, 3);
            redirectUrl = redirectUrl.join('/');
            return res.redirect(redirectUrl);
        }
    }
    next();
}
module.exports.isValidMail = async(req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        req.flash('error', 'Kindly enter a registered email address!!');
        return res.redirect('/reset');
    }
    next();
}

module.exports.password = () => {
    let code = '123456';

    // for (let i = 1; i <= 6; i++) {
    //     code += Math.floor(Math.random() * (9) + 1).toString();
    // }
    return code;
}

module.exports.isConfirmed = (req, res, next) => {
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
        req.flash('error', 'Both the passwords should be same!!');
        return res.redirect('/reset/new');
    }
    next();
}

module.exports.isAuthorised = (req, res, next) => {
    console.log(req.session.transactionData);
    if (!req.session.transactionData) {
        return res.render('error', { err: 'Sorry!! You are requesting a wrong URL.' });
    }
    next();
}