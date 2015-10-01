// modules =================================================
var User = require('../models/user');

// configuration ===========================================
module.exports = {
  jwtOpts: {
    secretOrKey: process.env.tokenSecret || 'notreallyasecret',
    algorithms: 'HS256',
    authScheme: 'Bearer',
    passReqToCallback: false
  },

  jwtAuth: function(payload, next) {
    User.findOne({username: payload}, function(err, user) {
      if (err) return next(err, false);

      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
  }
};
