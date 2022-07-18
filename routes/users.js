const express = require('express');
const router = express.Router();
const ExpressError = require('../utilities/ExpressError');
const wrapAsync = require('../utilities/wrapAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req,res) =>{
    res.render('users/register')
});

router.post('/register', wrapAsync(async( req, res, next) =>{
    try{
    const {email, username, password} = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user , password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to Tuck N Shop');
        res.redirect('/localshops');
    });
    }catch(e){
        req.flash('error','Username already exists');
        res.redirect('/register');
    }
}));

router.get('/login', (req,res) =>{
    res.render('users/login');
});

router.post('/login', passport.authenticate('local',{ failureFlash:true, failureRedirect:'/login'}) ,(req,res) =>{
        req.flash('success', 'Welcome back!');
        const redirectUrl = req.session.returnTo || '/localshops';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});

router.get('/logout', async (req, res , next) =>{
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        // if you're using express-flash
        req.flash('success', 'see you next time');
        res.redirect('/localshops');
      });
});

module.exports = router;