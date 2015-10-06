// modules =================================================
var passport = require('passport');
var path = require('path');
var utils = require('./utils');

module.exports = function(app, express) {
  // API routes ====================================================
  // status code 401 if unauthorized
  // pass token in req.headers.Authorizaion as 'Bearer [token]'
  var usersRouter = express.Router();
  app.use('/api/users', passport.authenticate('jwt', {session: false}),
    usersRouter);
  require('./users')(usersRouter);

  var recordsRouter = express.Router();
  app.use('/api/records', passport.authenticate('jwt', {session: false}),
    recordsRouter);
  require('./records')(recordsRouter);

  // public API routes, for extension development only =============
  var User = require('../models/user');
  var publicRouter = express.Router();
  app.use('/public', function(req, res, next) {
    User.findOne({username: 'publicuser'}, function(err, user) {
      if (err) return next(err);

      req.user = user;
      next();
    });
  }, publicRouter);
  require('./public')(publicRouter);

  // authentication routes =========================================
  var authRouter = express.Router();
  app.use('/authenticate', authRouter);
  require('./authenticate')(authRouter);

  // frontend routes ===============================================
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
  });
};
