//Using environment variables in development environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Loading all the necessary dependencies
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

//Routes
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');

//Apis
const productApi = require('./routes/apis/productapi');
const cartApi = require('./routes/apis/cartapi');



//connecting to the mongo DB database
const dbUrl = process.env.db_URL
mongoose.connect(dbUrl)
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log(err);
    });


//Configuring templating engine to EJS
app.set('view engine', 'ejs');
//Configuring ejsMate for reading ejs files
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));



//configuring the session object
const secret = process.env.SECRET || 'weneedagoodsecret';

const store = MongoStore.create({
    secret,
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60
});

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1 * 7 * 24 * 60 * 60 * 1000),
        maxAge: (1 * 7 * 24 * 60 * 60 * 1000)
    }
}

app.use(session(sessionConfig));


//configuring passport for authentication

passport.use(new LocalStrategy(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



//Dummy data for testing
const seed = require('./seed');

// seed();

app.get('/', (req, res) => {
    res.render('home');
})

//Route handles
app.use('/products', productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productApi);
app.use(cartRoutes);
app.use(cartApi);
app.use(paymentRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.all('*', (req, res) => {
    res.render('error', { err: 'You are requesting a wrong url!!!' })
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});