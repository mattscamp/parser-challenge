var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream')
    , helpers = require('./helpers');

const DEFAULT_REGEX_WILDCARD = /{(.*)}/;
const DEFAULT_METHOD_WILDCARD = /method=(.*?)\s/;
const DEFAULT_PATH_WILDCARD = /path=(.*?)\s/;
const DEFAULT_DYNO_WILDCARD = /dyno=(.*?)\s/;
const DEFAULT_SERVICE_WILDCARD = /service=(.*?)ms\s/;
const DEFAULT_CONNECT_WILDCARD = /connect=(.*?)ms\s/;

/**
 * Create a log parser.
 *
 */
function Parser(opts) {
  this.logFile = opts.logFile || "sample.log";
  this.validMethod = ["GET", "POST"];
  this.endpoints = []
  this.matchers = {
    url: DEFAULT_REGEX_WILDCARD,
    request: DEFAULT_METHOD_WILDCARD,
    path: DEFAULT_PATH_WILDCARD,
    dyno: DEFAULT_DYNO_WILDCARD,
    service: DEFAULT_SERVICE_WILDCARD,
    connect: DEFAULT_CONNECT_WILDCARD
  };

  // Replace with * wildcards for faster parsing later on
  // and separate out request method. We also want to store
  // a compiled regex so we don't need to waste resources
  // compiling it at run time
  if (opts.endpoints) {
    for (i in opts.endpoints) {
      var endpoint = {};
      var fragment = opts.endpoints[i].split(/(\s+)/);

      endpoint.url = fragment[2].replace(this.matchers.url, "*");
      endpoint.request = fragment[0];
      endpoint.regex = new RegExp("^" + endpoint.url.split("*").join(".*") + "$");

      this.endpoints[i] = endpoint;
    }
  }
}
/**
 * Parse request method from string
 *
 */
Parser.prototype.parseMethod = function (data) {
  var r  = data.match(this.matchers.request);
  
  if (r.length < 1) {
    console.log("Malformed line when parsing METHOD: " + data);
    return false;
  }

  if (this.validMethod.indexOf(r[1]) <= -1) {
    console.log("Invalid method for: " + data);
    return false;
  }

  return r[1];
}
/**
 * Parse path from string
 *
 */
Parser.prototype.parsePath = function(data) {
  var r  = data.match(this.matchers.path);

  if (r.length < 1) {
    console.log("Malformed line when parsing PATH: " + data);
    return false;
  }

  return r[1];
}
/**
 * Parse dyno from string
 *
 */
Parser.prototype.parseDyno = function(data) {
  var r  = data.match(this.matchers.dyno);
  
  if (r.length < 1) {
    console.log("Malformed line when parsing DYNO: " + data);
    return false;
  }

  return r[1];
}

/**
 * Parse service time from string
 *
 */
Parser.prototype.parseTime = function(data) {
  var rServ  = data.match(this.matchers.service);
  var rConn  = data.match(this.matchers.connect);

  if (rServ.length < 1 || rConn.length < 1) {
    console.log("Malformed line when parsing TIME: " + data);
    return false;
  }

  var resServ = parseInt(rServ[1]);
  var resConn = parseInt(rConn[1]);

  return resServ + resConn;
}
/**
 * Aggregate data
 *
 */
Parser.prototype.aggregate = function(cb) {
  var self = this;
  var complete = false;
  var map = {};
  var res = [];

  var stream = fs.createReadStream(self.logFile)
    .pipe(es.split())
    .pipe(es.mapSync(function(data){
      var path = self.parsePath(data);
      var req = self.parseMethod(data);
      var dyno = self.parseDyno(data);
      var time = self.parseTime(data);

      for (i in self.endpoints) {
        var endpoint = self.endpoints[i];

        if (endpoint.regex.test(path) && endpoint.request == req) {
          var key = endpoint.request + ' ' + endpoint.url;
          map[key] = map[key] || { calls: 0, times: [], sumTime: 0, dynos: [] };
          map[key].calls++;
          map[key].sumTime += time;
          map[key].dynos.push(dyno);

          helpers.binaryInsert(time, map[key].times);

          break;
        }
      }
    })
    .on('error', function(){
      console.log('Error while reading file.');
    })
    .on('end', function(){
      for (key in map) {
        var point = map[key];
        var median = helpers.median(point.times);
        var mode = helpers.mode(point.times)
        
        res.push({ 
          path: key, 
          calls: point.calls, 
          mean: point.sumTime / point.calls,
          median: median,
          mode: mode,
          dyno: helpers.mode(point.dynos)
        });
      }
      cb(res);
    })
  );
};

exports.Parser = Parser;
