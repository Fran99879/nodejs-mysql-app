const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const { engine } = require("express-handlebars");
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const validator = require('express-validator');
const bodyParser = require('body-parser');

//const { database } = require('./keys.js')

// initializations
const app = express();
require('../src/lib/passport.js');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", engine({
    extname: "hbs",
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs')

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore() // Aquí pasamos la instancia de MySQLStore
}));

/*app.use(session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore()
}));*/
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


// Routes 
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


// Public
app.use(express.static(path.join(__dirname, 'public')));


// Starting the Server

app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'));
});
