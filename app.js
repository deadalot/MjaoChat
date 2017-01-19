var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),    
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy


app.set('views', path.join(__dirname, 'views')); //use path to set the views folder
app.engine('html', require('hogan-express')); //template engine
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public'))); //./public static files
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development'; //in console: export NODE_ENV=production (OSX, linux) or set NODE_ENV=production (win)
if(env === 'development'){     
    //dev specific settings
    app.use(session({    
        secret:config.sessionSecret,
        store: new ConnectMongo({
            url:config.dbURL,
            stringify:true
        }),
        saveUninitialized:true, 
        resave:true
    }));  
} else {
    //prod specific settings
    app.use(session({
        secret:config.sessionSecret,
        store: new ConnectMongo({
            url:config.dbURL,
            stringify:true
        }),
        saveUninitialized:true, 
        resave:true
    }));   //different for production how its stored
                                                //     Warning: connect.session() MemoryStore is not
                                                // designed for a production environment, as it will leak
                                                // memory, and will not scale past a single process.
                                                //Use DB or Redis
}

//Test mongoos database 
// var userSchema = mongoose.Schema({
//     username:String,
//     password:String,
//     fullname:String
// })
// var Person = mongoose.model('users', userSchema);
// var Jhon = new Person({
//     username:'Jhon Doe',
//     password:'test123',
//     fullname:'Jhon Sven Doe'
// })
// Jhon.save(function(err){
//     console.log('Saved Data');
// })



app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport);
//app.route('/').get(function(req, res, next){
    //res.send('<h1>helo world</h1>');
    //res.render('index', {title: 'Welcome to MjaoChat!'});
//})

app.listen(8081, function(){
    console.log('MjaoChat running on Port 8081');
    console.log('Mode: ' + env); 
})

