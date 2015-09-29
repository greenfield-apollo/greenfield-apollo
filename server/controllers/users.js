// modules =================================================
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

  verifyHabit: function(req, res, next) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) return next(err);

      user.habits.forEach(function(habit) {
        if (habit.id === req.params.id) {
          // store the user model and habit reference in the request for other
          // middlewares
          req.mw_params = {
            dbUser: user,
            dbHabit: habit
          };

          return next();
        }
      });

      if (!req.mw_params) {
        next(utils.err('Habit ID does not belong to this user.'));
      }
    });
  },

  checkinHabit: function(req, res, next) {
    // passed down by verifyHabit()
    var user = req.mw_params.dbUser;
    var habit = req.mw_params.dbHabit;

    if (habit.lastCheckin && utils.recentlyCheckedIn(habit, 1)) {
      return next(utils.err('Already completed this habit today.'));
    } else {
      if (utils.recentlyCheckedIn(habit, 2)) {
        habit.streak++;
      } else {
        habit.streak = 0;
      }

      habit.lastCheckin = new Date();
      habit.streakRecord = Math.max(habit.streakRecord, habit.streak);

      user.save(function(err) {
        if (err) return next(err);

        next();
      });
    }
  },

  update: function(req, res, next) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) return next(err);

      var updated = false;

      user.habits.forEach(function(habit) {
        // reset habit streak if last check-in time is more than 48 hours
        // before the due time today
        if (habit.lastCheckin && !utils.recentlyCheckedIn(habit, 2)) {
          habit.streak = 0;
          updated = true;
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
