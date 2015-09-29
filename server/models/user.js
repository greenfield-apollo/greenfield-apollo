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

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  habitLimit: {
    type: Number,
    default: 1
  },

  habits: [HabitSchema]
});

module.exports = mongoose.model('User', UserSchema);
