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

  status: {
    type: String
  },

  lastCheckin: Date,

  canCheckin: {
    type: Boolean,
    default: true
  },

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
