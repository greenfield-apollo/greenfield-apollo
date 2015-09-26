// modules =================================================
var User = require('../models/user');

module.exports = {
  addHabit: function(req, res) {
    User.findOne({username: req.user}, function(err, user) {
      if (err) throw err;

      var habit = {};

      if (req.body.habitName) {
        habit.habitName = req.body.habitName;
      }

      if (req.body.reminderTime) {
        habit.reminderTime = new Date(req.body.reminderTime);
      }

      if (req.body.dueTime) {
        habit.dueTime = new Date(req.body.dueTime);
      }

      user.habits.push(habit);

      user.save(function(err) {
        if (err) {
          // mongoose does not handle MongoDB validation errors
          res.json({success: false, message: 'Error adding habit.'});
        }

        console.log('New habit added to user.');
        res.json({success: true, message: 'Habit added.'});
        return;
      });
    });
  }
};
