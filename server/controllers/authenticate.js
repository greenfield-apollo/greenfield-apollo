// modules =================================================
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var utils = require('../middlewares/utils');

module.exports = {
  signin: function(req, res, next) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) return next(err);

      if (!user) {
        return next(utils.err('User not found.'));
      } else if (user.password !== req.body.password) {
        return next(utils.err('Wrong password.'));
      } else {
        var token = utils.issueToken(req.body.username);

        res.json({
          message: 'Token issued.',
          token: token
        });
      }
    });
  },

  signup: function(req, res, next) {
    var userData = {
      username: req.body.username,
      password: req.body.password
    }
    if (!utils.checkProperty(userData, next)) {
      return;
    } else {
      User.findOne({
        username: req.body.username
      }, function(err, user) {
        if (err) return next(err);

        if (user) {
          return next(utils.err('Username already taken.'));
        } else {
          var newUser = new User(userData);

          newUser.save(function(err) {
            if (err) return next(err);

            console.log('New user ' + req.body.username + ' created.');

            var token = utils.issueToken(req.body.username);

            res.json({
              message: 'New user registered.',
              token: token
            });
          });
        }
      });
    }
  }
};
