var express = require('express');
var path = require('path');

// Initial 
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public default
app.use(express.static(path.join(__dirname, 'public')));

// Home / index
app.get('/', function(req, res){
    res.send("it's works")
});

// Setup server
var port = 3000;
app.listen(port, function(){
    console.log("Server running on port " + port)
});
