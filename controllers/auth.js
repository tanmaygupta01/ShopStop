const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const { password } = require('../middlewares');
const dotenv = require('dotenv');
dotenv.config();

module.exports.registerForm = (req, res) => {
    res.render('./auth/signup');
}

module.exports.registerUser = async(req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = await User.register({ username, email, role }, password);
        req.login(newUser, function(err) {
            if (err) { return next(err); }
            req.flash('success', `You registered successfully!! Welcome to ShopStop ${req.user.username}`)
            return res.redirect('/products');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('./auth/login');
}

module.exports.loginUser = (req, res) => {
    console.log('Logged in successfully');

    let redirectUrl = req.session.returnUrl;

    if (redirectUrl) {
        if (redirectUrl.indexOf('reviews') !== -1) {
            redirectUrl = redirectUrl.split('/');
            redirectUrl = redirectUrl.slice(0, 3);
            redirectUrl = redirectUrl.join('/');
        }
        delete req.session.returnUrl;
        return res.redirect(redirectUrl);
    }

    req.flash('success', `Welcome back again, ${req.user.username}`);
    res.redirect('/products');
}

module.exports.verificationForm = (req, res) => {
    res.render('./auth/reset');
}

module.exports.verification = (req, res) => {
    const { email } = req.body;
    const API_KEY = process.env.sendgrid_APIKEY;

    sgMail.setApiKey(API_KEY);


    const sentPassword = password();

    req.session.sentPassword = sentPassword;

    const msg = {
        to: email,
        from: {
            name: 'ShopStop',
            email: 'gupta.tanmay01@gmail.com'
        },
        subject: "User's One Time Password",
        text: `Your One Time Password is : ${sentPassword}`,
        html: `<p>Your One Time Password is : ${sentPassword}</p>`
    }

    sgMail.send(msg)
        .then(() => {
            req.session.email = email;
            res.redirect('/reset/otp');
        })
        .catch(err => console.log(err));

}

module.exports.verificationOtp = (req, res) => {
    const email = req.session.email;
    res.render('./auth/otp', { email });
}

module.exports.verificationOtpCheck = (req, res) => {

    if (req.session.sentPassword !== req.body.otp) {
        req.flash('error', 'Invalid OTP!!');
        return res.redirect('/reset/otp');
    }
    res.redirect('/reset/new');
}

module.exports.newpasswordForm = (req, res) => {
    res.render('./auth/newPassword');
}

module.exports.updatePassword = async(req, res) => {
    const email = req.session.email;
    const user = await User.findOne({ email });
    const { newPassword } = req.body;
    await user.setPassword(newPassword);
    await user.save();
    delete req.session.email;
    delete req.session.sentPassword;
    res.redirect('/login');
}

module.exports.logoutUser = function(req, res) {
    const name = req.user.username;
    req.logout();
    console.log('Logged out successfully');
    req.flash('success', `Goodbye ${name}, see you again! :)`);
    res.redirect('/products');
}