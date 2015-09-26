// modules =================================================
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports = {
  // issues jwt token with username as payload
  issueToken: function(username) {
    return jwt.sign(username, config.secret, {
      expiresInMinutes: 60 * 24
    });
  },

  authErrHandler: function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token.');
    }
  }
};
