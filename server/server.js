// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// configuration ===========================================
app.port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/habitdb',
  function(err) {
    if (err) throw err;
  });
var User = require('./models/user');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

// routes ==================================================
require('./middlewares/router')(app);

module.exports = app;
