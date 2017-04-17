// modules =================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var HabitSchema = require('./habit');

// schema ==================================================
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    set: function(username) {
      return username.toLowerCase();
    }
  },

  password: {
    type: String,
    required: true
  },

  habitCount: {
    type: Number,
    default: 0
  },

  habitLimit: {
    type: Number,
    default: 3
  },

  habits: [HabitSchema]
});

UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, match) {
    if (err) return cb(err);
    cb(null, match);
  });
};

// hash the password if it's new or modified
UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  } else {
    bcrypt.genSalt(function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  }
});

module.exports = mongoose.model('User', UserSchema);
