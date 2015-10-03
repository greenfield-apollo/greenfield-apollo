// modules =================================================
var Record = require('../models/record');

module.exports = {
  getRecords: function(req, res, next) {
    var checkinDates = [];

    Record.find({habitId: req.params.id}, function(err, records) {
      if (err) return next(err);

      records.forEach(function(record) {
        checkinDates.push(record.checkinDate);
      });

      res.json({records: checkinDates});
    });
  },

  addRecord: function(req, res, next) {
    var newRecord = new Record({
      habitId: req.params.id,
      checkinDate: req.mw_params.checkin
    });

    newRecord.save(function(err) {
      if (err) return next(err);

      console.log('Habit ' + req.params.id + ' checked in.');
      res.json({message: 'Checked in successfully.'});
    });
  }
};
