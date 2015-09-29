// modules =================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema ==================================================
var RecordSchema = new Schema({
  habitId: {
    type: String,
    required: true
  },

  checkinDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Record', RecordSchema);