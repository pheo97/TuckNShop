const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.viewRegister);

router.post('/register', wrapAsync(users.register));

router.get('/login', users.viewLogin);

router.post('/login', passport.authenticate('local',{ failureFlash:true, failureRedirect:'/login'}) , users.login);

router.get('/logout', users.logout);

module.exports = router;