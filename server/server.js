// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('express-error-handler');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var config = require('./config/config');
var strategies = require('./config/strategies');

// configuration ===========================================
app.set('port', process.env.PORT || config.port);

var dbURI = process.env.MONGOLAB_URI || config.localdb;
mongoose.connect(dbURI);
var db = mongoose.connection;

db.on('error', function(err) {
  console.error('Mongoose connection error, retrying in 5 seconds.');
  setTimeout(function() {
    mongoose.connect(dbURI);
  }, 5000);
});
db.on('connected', function() {
  console.log('Mongoose connection open to ' + dbURI);
});
db.on('disconnected', function() {
  console.log('Mongoose connection disconnected.');
});

passport.use(new JwtStrategy(strategies.jwtOpts, strategies.jwtAuth));

// middlewares =============================================
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

// routes ==================================================
require('./middlewares/router')(app, express);

app.use(errorHandler({server: app}));

module.exports = app;
