// modules =================================================
var moment = require('moment');
var utils = require('../middlewares/utils');

module.exports = {
  showHabits: function(req, res, next) {
    var summary = {
      habitCount: req.user.habitCount,
      habitLimit: req.user.habitLimit,
      habits: req.user.habits,
    };

    summary.habits.forEach(function(habit) {
      // temporarily modifies the data for frontend to display, does not
      // actually update the database (that would be done at midnight)
      if (!habit.active) {
        habit.status = 'inactive';
      } else if (utils.checkedInToday(habit)) {
        habit.status = 'completed';
      } else if (utils.pastDueTime(habit)) {
        habit.streak = 0;
        habit.failedCount++;
        habit.status = 'failed';
      } else {
        habit.status = 'pending';
      }
    });

    res.json(summary);
  },

  addHabit: function(req, res, next) {
    var habit = {
      habitName: req.body.habitName,
      reminderTime: req.body.reminderTime,
      dueTime: req.body.dueTime
    };

    if (req.user.habitCount >= req.user.habitLimit) {
      return next(utils.err('Habit limit reached.'));
    } else if (!utils.checkProperty(habit, next)) {
      return;
    } else {
      if (utils.pastDueTime(habit)) {
        // to prevent marking today as "failed" at midnight if habit is created
        // after due time
        habit.lastCheckin = moment().startOf('day');
      }

      req.user.habits.push(habit);
      req.user.habitCount++;

      req.user.save(function(err) {
        if (err) return next(err);

        console.log('New habit added to user.');
        res.json({message: 'Habit added.'});
      });
    }
  },

  verifyHabit: function(req, res, next) {
    req.user.habits.forEach(function(habit) {
      if (habit.id === req.params.id) {
        // store the matching habit reference in the request for other
        // middlewares
        req.mw_params = {dbHabit: habit};

        return next();
      }
    });

    if (!req.mw_params) {
      next(utils.err('Habit ID does not belong to this user.'));
    }
  },

  editHabit: function(req, res, next) {
    // passed down by verifyHabit()
    var habit = req.mw_params.dbHabit;

    var edited = false;

    if (!habit.active) {
      return next(utils.err('Cannot edit inactive habit.'));
    } else {
      if (req.body.active === false) {
        habit.active = false;
        habit.canCheckin = false;
        req.user.habitCount--;
        edited = true;

        // stats catch-up for the last time
        if (!utils.checkedInToday(habit)) {
          habit.streak = 0;
          habit.failedCount++;
        }
      } else {
        if (req.body.reminderTime) {
          habit.reminderTime = req.body.reminderTime;
          edited = true;
        }

        if (req.body.dueTime) {
          habit.dueTime = req.body.dueTime;
          edited = true;
        }
      }

      if (edited) {
        req.user.save(function(err) {
          if (err) return next(err);

          res.json({message: 'Habit edited.'});
        });
      } else {
        res.json({message: 'No change made to habit.'});
      }
    }
  },

  checkinHabit: function(req, res, next) {
    var habit = req.mw_params.dbHabit;

    if (!habit.active) {
      return next(utils.err('This habit has been deactivated.'));
    }
    else if (!habit.canCheckin) {
      return next(utils.err('Already completed this habit today.'));
    } else if (utils.pastDueTime(habit)) {
      return next(utils.err('It is already past due time today.'));
    } else {
      if (utils.checkedInYesterday(habit)) {
        habit.streak++;
      } else {
        habit.streak = 1;
      }

      req.mw_params.checkin = habit.lastCheckin = Date.now();
      habit.checkinCount++;
      habit.canCheckin = false;
      habit.streakRecord = Math.max(habit.streakRecord, habit.streak);

      req.user.save(function(err) {
        if (err) return next(err);

        next();
      });
    }
  }
};
