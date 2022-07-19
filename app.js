const express = require ('express');
const path = require ('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const ExpressError = require('./utilities/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');



const { urlencoded } = require('express');

const app = express();
 

const localshopRoutes = require('./routes/localshops');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/tuck-n-shop',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database connected");
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret:'thisisasecret',
    resave: false,
    saveUninitialized  : true,
    cookie:{
        httpOnly: true,
        expires:Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    if(!['/login', '/' ].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeuser', async (req,res) =>{
    const user = new User({ email : 'col@gmail.com' , username : 'coltt'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/localshops', localshopRoutes);
app.use('/localshops/:id/reviews/', reviewRoutes);
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*',(req,res,next)=>{
    next(new ExpressError('PAGE NOT FOUND',404))
})

app.use((err,req,res,next)=>{
   const { statusCode = 500} = err;
   if(!err.message) err.message = 'UH OH SOMETHING WENT WRONG'
   res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Running port on 3000")
})