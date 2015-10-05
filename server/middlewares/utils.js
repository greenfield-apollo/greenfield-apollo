// modules =================================================
var util = require('util');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../config/config');

module.exports = {
  // issues jwt token with user identifier and user type as payload
  issueToken: function(identifier, type) {
    return jwt.sign({
      user: identifier,
      type: type
    }, config.tokenSecret, {
      expiresIn: 60 * 60 * 24
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

  checkedInYesterday: function(habit) {
    if (!habit.lastCheckin) {
      return false;
    } else {
    return moment(habit.lastCheckin).isSame(moment().subtract(1, 'day'), 'day');
    }
  },

  checkedInToday: function(habit) {
    if (!habit.lastCheckin) {
      return false;
    } else {
      return moment(habit.lastCheckin).isSame(moment(), 'day');
    }
  },

  pastReminderTime: function(habit) {
    return moment().hour() >= moment(habit.reminderTime).hour()
      && moment().minute() >= moment(habit.reminderTime).minute();
  },

  pastDueTime: function(habit) {
    return moment().hour() >= moment(habit.dueTime).hour()
      && moment().minute() >= moment(habit.dueTime).minute();
  }
};
