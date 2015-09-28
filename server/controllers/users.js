// modules =================================================
var moment = require('moment');
var utils = require('../middlewares/utils');
var User = require('../models/user');

module.exports = {
  showHabits: function(req, res, next) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) return next(err);

      res.json({habits: user.habits});
    });
  },

  addHabit: function(req, res, next) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) return next(err);

      habit = {
        habitName: req.body.habitName,
        reminderTime: req.body.reminderTime,
        dueTime: req.body.dueTime
      };

      if (!utils.checkProperty(habit, next)) {
        return;
      } else {
        user.habits.push(habit);

        user.save(function(err) {
          if (err) return next(err);

          console.log('New habit added to user.');
          res.json({message: 'Habit added.'});
        });
      }
    });
  },

  update: function(req, res, next) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) return next(err);

      var updated = false;

      user.habits.forEach(function(habit) {
        // reset habit streak if last check-in time is more than 48 hours
        // before the due time today
        if (habit.lastCheckin) {
          var cutOff = moment().hour(habit.dueTime.getHours())
            .minute(habit.dueTime.getMinutes())
            .subtract(2, 'days');

          if (moment(habit.lastCheckin).isBefore(cutOff)) {
            habit.streakRecord = Math.max(habit.streakRecord, habit.streak);
            habit.streak = 0;
            updated = true;
          }
        }
      });

      if (updated) {
        user.save(function(err) {
          if (err) return next(err);

          console.log('Habit streak records updated.');
          next();
        });
      } else {
        next();
      }
    });
  }
};
