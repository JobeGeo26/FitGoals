var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var index = require("./routes/index");
var about = require("./routes/about");


var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views",path.join(__dirname,"views"));
app.set('view engine', 'hbs');


app.use("/",index);
app.use("/about",about);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get("port"),function(req,res){
    console.log("Server started on port" +app.get("port"));
});

