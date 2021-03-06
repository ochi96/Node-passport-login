const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport =require('passport');


const app = express();


//passport config
require('./config/passport')(passport);
//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser:true})
.then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

 
//EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());

//Global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
 

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;
 
app.listen(PORT, console.log(`Server started on port ${PORT}`));

