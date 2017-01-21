'USE STRICT';
var assert = require('assert');
var datePreciseRange = require('./date-precise-range');

describe('datePreciseRange', function() {
  it('calculates date range precisely', function() {
    var date1 = new Date(2017, 11, 13, 18, 42, 24, 420);
    var date2 = new Date(2019,  4,  4,  8,  8,  8,   8);
    diff = datePreciseRange(date1, date2, true);
    assert.ok( !!diff );
    assert.equal( diff.year, 1 );
    assert.equal( diff.month, 4 );
    assert.equal( diff.day, 20 );
    assert.equal( diff.hour, 13 );
    assert.equal( diff.minute, 25 );
    assert.equal( diff.second, 43 );
    assert.equal( diff.millisecond, 588 );
  });
});
