// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

// configuration ===========================================
app.port = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

// routes ==================================================
require('./middlewares/router')(app);

module.exports = app;