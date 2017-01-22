var express = require('express');
var api = require('./api')(express);
var superagent = require('superagent');
var assert = require('assert');

describe('time API', function() {
  var app, server;
  var root = 'http://localhost:3000/';
  var result;

  before(function() {
    app = express();
    app.use(api);
    server = app.listen(3000);
  });

  after(function() {
    server.close();
  });

  it('can parse string into date/time', function(done) {
    superagent
    .get(root + 'time/' + encodeURIComponent('Jan 22nd, 2017 12:34:56'))
    .end(function(err, res) {
      assert.ifError(err);
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.ok( !!result );
      assert.equal(result.timestamp,
                   new Date(Date.UTC(2017,0,22,12,34,56)).getTime());
      assert.ok( !!result.string );
      done();
    });
  });

  it('can calculate time difference', function(done) {
    superagent
    .get(root + 'timediff/Jan 22nd, 2017 12:34:56/'
              + 'Feb 23rd, 2018 13:35:57')
    .end(function(err, res) {
      assert.ifError(err);
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.ok( !!result );
      assert.equal(result.precise,
        '1 year 1 month 1 day 1 hour 1 minute 1 second');
      assert.equal( Math.floor(result.year), 1 );
      assert.equal( Math.floor(result.month), 13 );
      assert.ok( result.day && result.hour && result.minute &&
                 result.second );
      done();
    });
  });
});
