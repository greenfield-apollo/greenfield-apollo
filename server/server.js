// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// configuration ===========================================
var config = require('./config/config');
app.set('port', process.env.PORT || config.port);

mongoose.connect(process.env.MONGOLAB_URI || config.localdb,
  function(err) {
    if (err) throw err;
  });
var User = require('./models/user');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

// routes ==================================================
require('./middlewares/router')(app, express);

module.exports = app;
