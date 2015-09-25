// modules =================================================
var mongoose = require('mongoose');

// schema ==================================================
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  daily1: {
    type: Number
  },

  daily2: {
    type: Number
  },

  daily3: {
    type: Number
  }
});

module.exports = mongoose.model('User', UserSchema);
