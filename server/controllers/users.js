// modules =================================================
var utils = require('../middlewares/utils');
var User = require('../models/user');

module.exports = {
  addHabit: function(req, res, next) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) return next(err);

      habits = {
        habitName: req.body.habitName,
        reminderTime: req.body.reminderTime,
        dueTime: req.body.dueTime
      };

      if (!utils.checkProperty(habits, next)) {
        return;
      } else {
        user.habits = habits;

        user.save(function(err) {
          if (err) return next(err);

          console.log('New habit added to user.');
          res.json({message: 'Habit added.'});
          next();
        });
      }
    });
  }
};
