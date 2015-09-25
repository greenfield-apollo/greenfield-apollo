// modules =================================================
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports = {
  // issues jwt token with username as payload
  issueToken: function(username) {
    return jwt.sign(username, config.secret, {
      expiresInMinutes: 60 * 24
    });
  }
};
