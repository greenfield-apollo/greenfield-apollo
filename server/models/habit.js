// modules =================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema ==================================================
var HabitSchema = new Schema({
  habitName: {
    type: String,
    required: true
  },

  reminderTime: {
    type: Date,
    required: true
  },

  dueTime: {
    type: Date,
    required: true
  },

  active: {
    type: Boolean,
    default: true
  },

  lastCheckin: Date,

  streak: {
    type: Number,
    default: 0
  },

  streakRecord: {
    type: Number,
    default: 0
  }
});

module.exports = HabitSchema;
