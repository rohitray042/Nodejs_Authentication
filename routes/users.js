const express = require('express');
const router = express.Router();
const passport = require('passport');

// user model
const User = require('../models/user');

//Check if user is authenticate
const isAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Please Log in first to Access this page');
    res.redirect('/login');
}


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/dashboard', isAuthenticatedUser,(req, res) => {
    res.render('dashboard');
});

router.get('/logout',(req, res) => {
    req.logOut();
    req.flash('success_msg','You have been logged out');
    res.redirect('/login');
})

router.post('/login',passport.authenticate('local',{
    successRedirect :'/dashboard', 
    failureRedirect :'/login',
    failureFlash :'Invalid email or password. Try Again !!'
}));

router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;

    let userData = {
        name: name,
        email: email
    };

    User.register(userData, password ,(err, user) => {
        if(err) {
            req.flash('error_msg', 'Error: ' + err);
            res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success_msg', 'Account created successfully');
            res.redirect('/login');
        })
    });
})

module.exports = router;