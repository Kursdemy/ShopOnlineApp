var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var pages = require('./routes/pages.js');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session')

// Connection Mongodb
mongoose.connect(config.database ,{useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to database")
});

// Initial 
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public default
app.use(express.static(path.join(__dirname, 'public')));

// set routes index
app.use('/', pages);

// set routes admin area
var adminPages = require('./routes/admin_pages.js');
app.use('/admin/pages', adminPages);

// setup body parser middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// setup express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true}
}));

// setup express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + messages.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// setup express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Setup server
var port = 3000;
app.listen(port, function(){
    console.log("Server running on port " + port)
});
