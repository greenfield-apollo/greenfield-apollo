var expect = require('chai').expect;
var app = require('../server/server.js');
var request = require('supertest');

describe("server", function() {
  describe("GET /", function () {
    it("should return the content of index.html", function (done) {
      request(app)
        .get('/')
        .expect(200, /<title>Habit Trainer/, done);
    });
  });
});