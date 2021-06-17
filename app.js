const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Router middleware for
const userRoutes = require('./routes/users');

// user model
const User =  require('./models/user');

dotenv.config({path: './config.env'});

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
});

app.use(express.static(path.join(__dirname,'public')))
//middleware for session
app.use(session({
    secret :'my simple authentication ',
    resave:true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({usernameField : 'email'},User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for Flash messages

app.use(flash());

//setting middleware globally
app.use((req,res,next) => {
    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;
    next();
});


// parse application/x-www-form-urlencode
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(userRoutes);

app.listen(80,()=>{
    console.log('listening on port 80');
});

