const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isValidMail, isConfirmed } = require('../middlewares');
const { registerUser, registerForm, loginUser, loginForm, verificationForm, verification, verificationOtp, verificationOtpCheck, newpasswordForm, updatePassword, logoutUser } = require('../controllers/auth');

const parser = express.urlencoded({extended:true});

router.route('/register')
        .get(registerForm)
        .post(parser, registerUser);

router.route('/login')
        .get(loginForm)
        .post(parser,
        passport.authenticate('local',  {
                                            failureRedirect: '/login',
                                            failureFlash: true
                                        }),
        loginUser);


router.route('/reset')
        .get(verificationForm)
        .post(parser, isValidMail, verification);
        
router.get('/reset/otp', verificationOtp);
router.post('/reset/otpcheck', parser, verificationOtpCheck);
router.get('/reset/new', newpasswordForm);
router.post('/reset/update', parser, isConfirmed, updatePassword);
router.get('/logout', logoutUser);


module.exports = router;