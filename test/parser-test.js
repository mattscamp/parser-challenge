var assert = require('assert'),
  Parser = require('../lib').Parser;

var endpoints = ["GET /api/users/{user_id}/count_pending_messages",
  "GET /api/users/{user_id}/get_messages",
  "GET /api/users/{user_id}/get_friends_progress",
  "GET /api/users/{user_id}/get_friends_score",
  "POST /api/users/{user_id}",
  "GET /api/users/{user_id}"];

var sample = '2014-01-09T06:18:06.923061+00:00 heroku[router]: at=info method=POST path=/api/users/1600923137 host=services.pocketplaylab.com fwd="72.49.126.42" dyno=web.3 connect=3ms service=55ms status=200 bytes=52';

describe('Parser', function() {

  describe('parse time', function() {
    it('should return an int', function() {
      var parser = new Parser({});
      assert.equal(parser.parseTime(sample), 58);
    });
  });

  describe('parse method', function() {
    it('should return a str of "POST"', function() {
      var parser = new Parser({});
      assert.equal(parser.parseMethod(sample), "POST");
    });
  });

  describe('parse dyno', function() {
    it('should return a str', function() {
      var parser = new Parser({});
      assert.equal(parser.parseDyno(sample), "web.3");
    });
  });

  describe('parse path', function() {
    it('should return a str', function() {
      var parser = new Parser({});
      assert.equal(parser.parsePath(sample), "/api/users/1600923137");
    });
  });

  describe('aggregate endpoints', function() {
    it('should return same count of endpoints as input', function(done) {
      var parser = new Parser({ endpoints: endpoints });
      assert.doesNotThrow(function() {
        parser.aggregate(function(data) {
          assert.equal(data.length, endpoints.length);
          done();
        });
      });
    });
  });

});