// modules =================================================
var request = require('request');
var User = require('../models/user');
var GoogleUser = require('../models/googleUser');
var utils = require('../middlewares/utils');
var config = require('../config/config');

module.exports = {
  signin: function(req, res, next) {
    User.findOne({
      username: req.body.username.toLowerCase()
    }, function(err, user) {
      if (err) return next(err);

      if (!user) {
        return next(utils.err('User not found.'));
      } else {
        user.comparePassword(req.body.password, function(err, match) {
          if (err) return next(err);

          if (!match) {
            return next(utils.err('Wrong password.'));
          } else {
            var token = utils.issueToken(user.username, 'JWT');

            res.json({
              message: 'Token issued.',
              token: token
            });
          }
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
        username: req.body.username.toLowerCase()
      }, function(err, user) {
        if (err) return next(err);

        if (user) {
          return next(utils.err('Username already taken.'));
        } else {
          var newUser = new User(userData);

          newUser.save(function(err) {
            if (err) return next(err);

            console.log('New user ' + newUser.username + ' created.');

            var token = utils.issueToken(newUser.username, 'JWT');

            res.json({
              message: 'New user registered.',
              token: token
            });
          });
        }
      });
    }
  },

  google: function(req, res, next) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl =
      'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.googleSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };

    request.post(accessTokenUrl, {
      json: true,
      form: params
    }, function(err, response, token) {
      var headers = {Authorization: 'Bearer ' + token.access_token};

      request.get({url: peopleApiUrl,
        headers: headers,
        json: true
      }, function(err, response, profile) {
        if (profile.error) {
          return res.status(500).send({message: profile.error.message});
        }

        GoogleUser.findOne({google: profile.sub}, function(err, user) {
          var token = utils.issueToken(profile.sub, 'google');

          if (user) {
            res.send({
              message: 'Token issued.',
              token: token
            });
          } else {
            var newUser = new GoogleUser({google: profile.sub});

            newUser.save(function(err) {
              res.send({
                message: 'New user registered.',
                token: token
              });
            });
          }
        });
      });
    });
  }
};
