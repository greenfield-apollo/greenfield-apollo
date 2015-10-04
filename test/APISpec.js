'use strict';

process.env.MONGOLAB_URI = 'mongodb://127.0.0.1:27017/habitdbtest';

var expect = require('chai').expect;
var app = require('../server/server');
var request = require('supertest');
var mongoose = require('mongoose');
var moment = require('moment');
var config = require('../server/config/config');
var User = require('../server/models/user');

var clearDB = function() {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }
};

if (mongoose.connection.readyState === 0) {
  mongoose.connect(config.localdb, function (err) {
    if (err) throw err;
    clearDB();
  });
} else {
  clearDB();
}

var agent = request.agent(app);
var token, habit0, habit1;

describe('Server Tests:', function() {
  this.timeout(5000);

  describe('Authentication:', function() {
    it('should deny access to private API when not signed in', function(done) {
      agent.get('/api/users/habits')
        .expect(401, done);
    });

    describe('Sign Up:', function() {
      it('should fail when username is not given', function(done) {
        agent.post('/authenticate/signup')
          .send({password: 'password'})
          .expect({
            status: 403,
            message: 'Not provided: username'
          }, done);
      });

      it('should fail when password is not given', function(done) {
        agent.post('/authenticate/signup')
          .send({username: 'testuser'})
          .expect({
            status: 403,
            message: 'Not provided: password'
          }, done);
      });

      it('should provide token on successful signup', function(done) {
        agent.post('/authenticate/signup')
          .send({
            username: 'testuser',
            password: 'password'
          })
          .expect(200)
          .expect(function(res) {
            expect(res.body.message).to.equal('New user registered.');
            expect(res.body.token).to.exist;
          })
          .end(done);
      });

      it('should fail when username is already taken', function(done) {
        agent.post('/authenticate/signup')
          .send({
            username: 'testuser',
            password: 'password'
          })
          .expect({
            status: 403,
            message: 'Username already taken.'
          }, done);
      });
    });

    describe('Sign In:', function() {
      it('should fail when username is not found', function(done) {
        agent.post('/authenticate/signin')
          .send({
            username: 'user',
            password: 'password'
          })
          .expect({
            status: 403,
            message: 'User not found.'
          }, done);
      });

      it('should fail when password is incorrect', function(done) {
        agent.post('/authenticate/signin')
          .send({
            username: 'testuser',
            password: 'pass'
          })
          .expect({
            status: 403,
            message: 'Wrong password.'
          }, done);
      });

      it('should provide token on successful signin', function(done) {
        agent.post('/authenticate/signin')
          .send({
            username: 'testuser',
            password: 'password'
          })
          .expect(200)
          .expect(function(res) {
            expect(res.body.message).to.equal('Token issued.');
            expect(res.body.token).to.exist;
            token = res.body.token;
          })
          .end(done);
      });
    });
  });

  describe('Private API:', function() {
    describe('/api/users/habits:', function() {
      it('should be able to add new habit', function(done) {
        var begin = function() {
          agent.post('/api/users/habits')
            .send({
              habitName: 'New habit 1',
              reminderTime: moment(),
              dueTime: moment().endOf('day')
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(200, cb1);
        };

        var cb1 = function() {
          agent.post('/api/users/habits')
            .send({
              habitName: 'New habit 2',
              reminderTime: moment(),
              dueTime: moment().endOf('day')
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(200, cb2);
        };

        var cb2 = function() {
          User.findOne({username: 'testuser'}, function(err, user) {
            if (err) console.log(err);

            expect(user.habits.length).to.equal(2);
            user.habits[0].lastCheckin = moment().subtract(24, 'hours');
            user.habits[0].streak = 3;
            habit0 = user.habits[0].id;
            user.habits[1].lastCheckin = moment().subtract(48, 'hours');
            user.habits[1].streak = 5;
            habit1 = user.habits[1].id;

            user.save(function(err) {
              if (err) console.log(err);

              done();
            });
          });
        };

        begin();
      });
    });

    describe('/api/records/<habit id>:', function() {
      it('should be able to check in', function(done) {
        var begin = function() {
          agent.post('/api/records/' + habit0)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, {message: 'Checked in successfully.'}, cb1);
        };

        var cb1 = function() {
          agent.post('/api/records/' + habit1)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, cb2);
        };

        var cb2 = function() {
          agent.get('/api/records/' + habit0)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(function(res) {
              expect(res.body.records.length).to.equal(1);
            })
            .end(done);
        };

        begin();
      });

      it ('should update streak correctly', function(done) {
        agent.get('/api/users/habits')
          .set('Authorization', 'Bearer ' + token)
          .expect(function(res) {
            expect(res.body.habits[0].streak).to.equal(4);
            expect(res.body.habits[0].streakRecord).to.equal(4);
            expect(res.body.habits[1].streak).to.equal(1);
          })
          .end(done);
      });

      it ('should fail if habit does not belong to user', function(done) {
        agent.post('/api/records/abc')
          .set('Authorization', 'Bearer ' + token)
          .expect({
            status: 403,
            message: 'Habit ID does not belong to this user.'
          }, done);
      });

      it ('should not be able to check in twice in a day', function(done) {
        agent.post('/api/records/' + habit0)
          .set('Authorization', 'Bearer ' + token)
          .expect({
            status: 403,
            message: 'Already completed this habit today.'
          }, done);
      });
    });
  });
});
