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

  // only used for GET /api/users/habits
  status: {
    type: String
  },

  // set to true when reminder notification is shown on the frontend
  reminded: {
    type: Boolean,
    default: false
  },

  // set to true when fail notification is shown on the frontend
  failed: {
    type: Boolean,
    default: false
  },

  lastCheckin: Date,

  checkinCount: {
    type: Number,
    default: 0
  },

  failedCount: {
    type: Number,
    default:0
  },

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
