// modules =================================================
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var utils = require('./utils');

module.exports = function(router) {
  // POST: /authenticate/signin
  // verifies username and password, issues token
  router.post('/signin', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({success: false, message: 'User not found.'});
      } else if (user.password !== req.body.password) {
        res.json({suceess: false, message: 'Wrong password.'});
      } else {
        var token = utils.issueToken(req.body.username);

        res.json({
          success: true,
          message: 'Token issued.',
          token: token
        });
      }
    });
  });

  // POST: /authenticate/signup
  // verifies unique username, add to Users collection, issues token
  router.post('/signup', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;

      if (user) {
        res.json({success: false, message: 'Username already taken.'});
      } else {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password
        });

        newUser.save(function(err) {
          if (err) throw err;
          console.log('New user ' + req.body.username + ' created.');

          var token = utils.issueToken(req.body.username);

          res.json({
            success: true,
            message: 'New user registered.',
            token: token
          });
        });
      }
    });
  });
};
