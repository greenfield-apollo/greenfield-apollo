var expect = require('chai').expect;
var app = require('../server/server.js');
var request = require('supertest');

var User = require('../server/models/user');

describe("server:", function() {
  describe("GET requests:", function () {
    it("accessing root should return the content of index.html", function (done) {
      request(app)
        .get('/')
        .expect(200, /<title>Habit Trainer/, done);
    });

    it("accessing other paths should return the content of index.html", function (done) {
      request(app)
        .get('/not/a/valid/path')
        .expect(200, /<title>Habit Trainer/, done);
    });
  });
});
