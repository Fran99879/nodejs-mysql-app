const express = require('express');
const morgan = require('morgan');
const { engine } = require("express-handlebars");
const path = require('path');

// initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine( "hbs", engine({ 
    extname: "hbs",
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./lib/handlebars')
}) );
app.set('view engine', '.hbs')

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables
app.use((req, res, next) => {
    next();
});


// Routes 
app.use(require ('./routes'));
app.use(require ('./routes/authentication'));
app.use('/links', require('./routes/links'));


// Public
app.use(express.static(path.join(__dirname, 'public')));


// Starting the Server
app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'));
});