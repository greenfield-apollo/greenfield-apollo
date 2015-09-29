// modules =================================================
var Record = require('../models/record');

module.exports = {
  addRecord: function(req, res, next) {
    var newRecord = new Record({
      habitId: req.params.id,
      checkinDate: new Date()
    });

    newRecord.save(function(err) {
      if (err) return next(err);

      console.log('Habit ' + req.params.id + ' checked in.');
      res.json({message: 'Checked in successfully.'});
    });
  }
};