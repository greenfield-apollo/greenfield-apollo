// modules =================================================
var util = require('util');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../config/config');

module.exports = {
  // issues jwt token with username as payload
  issueToken: function(username) {
    return jwt.sign(username, config.secret, {
      expiresInMinutes: 60 * 24
    });
  },

  // custom error generator: express-error-handler crashes the server by
  // default, changing the status code to something other than 5xx prevents
  // the behavior
  err: function(message) {
    var error = new Error(message);
    error.status = 403;
    return error;
  },

  // throws a 403 error if any of properties is not present or blank
  // pass an object with property names as keys and property values as
  // values for the first argument
  checkProperty: function(properties, next) {
    for (var key in properties) {
      if (!properties[key] || properties[key] === '') {
        next(this.err('Not provided: ' + key));
        return false;
      }
    }

    return true;
  },

  // checking in after due time today is considered the next day
  currentCheckinDate: function(habit) {
    if (moment().hour(habit.dueTime.getHours())
      .minute(habit.dueTime.getMinutes())
      .isBefore(moment(), 'minute')) {
      return moment().add(1, 'days');
    } else {
      return moment();
    }
  },

  // check if last check-in day is within X days of the current check-in day
  recentlyCheckedIn: function(habit, days) {
    var cutOff = this.currentCheckinDate(habit).subtract(days, 'days');

    return moment(habit.lastCheckin).isAfter(cutOff);
  }
};
