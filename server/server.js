// modules =================================================
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var bodyParser = require('body-parser');
var errorHandler = require('express-error-handler');
var morgan = require('morgan');
var mongoose = require('mongoose');

// configuration ===========================================
var config = require('./config/config');
app.set('port', process.env.PORT || config.port);

mongoose.connect(process.env.MONGOLAB_URI || config.localdb,
  function(err) {
    if (err) {
      console.error('Error connecting to MongoDB: ', process.env.MONGOLAB_URI || config.localdb);
      throw err;
    }
  });

var User = require('./models/user');

// middlewares =============================================
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

// routes ==================================================
require('./middlewares/router')(app, express);

app.use(errorHandler({server: server}));

module.exports = app;
