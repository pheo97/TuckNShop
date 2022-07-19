const User = require('../models/user');
const ExpressError = require('../utilities/ExpressError');


module.exports.viewRegister = (req,res) =>{
    res.render('users/register')
}

module.exports.register = async( req, res, next) =>{
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
};

module.exports.viewLogin = (req,res) =>{
    res.render('users/login');
}

module.exports.login = (req,res) =>{
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/localshops';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = async (req, res , next) =>{
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        // if you're using express-flash
        req.flash('success', 'see you next time');
        res.redirect('/localshops');
      });
};