'USE STRICT';
var assert = require('assert');
var dateDiff = require('./date-diff');
var moment = require('moment');

describe('dateDiff', function() {
  it('calculates difference between 2 date/time objects', function() {
    var d1 = new Date(2017,1,21,13,42,42);
    var d2 = new Date(2018,3,6,9);
    var diff = dateDiff(moment, d1, d2);
    var
      y = 1,
      m = y * 12 + 1,
      d = y * 365 + 43,
      h = d * 24 + 19,
      i = h * 60 + 17,
      s = i * 60 + 18,
      ms = 1000 * s;
    assert.ok( !!diff );
    assert.equal( Math.floor(diff.year), y );
    assert.equal( Math.floor(diff.month), m );
    assert.equal( Math.floor(diff.day), d );
    assert.equal( Math.floor(diff.hour), h );
    assert.equal( Math.floor(diff.minute), i );
    assert.equal( Math.floor(diff.second), s );
    assert.equal( Math.floor(diff.millisecond), ms );
  });
    
  it('accounts for leap year', function() {
    var d1 = new Date(2016,2,1);
    var d2 = new Date(2016,1,1);
    var diff = dateDiff(moment, d1, d2);
    assert.ok( !!diff );
    assert.equal( ~~diff.day, 29 );
  });
});
