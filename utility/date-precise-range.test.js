'USE STRICT';
var assert = require('assert');
var datePreciseRange = require('./date-precise-range');
var moment = require('moment');

describe('datePreciseRange', function() {
  it('calculates date range precisely', function() {
    var date1 = new Date(2017, 11, 13, 18, 42, 24, 420);
    var date2 = new Date(2019,  4,  4,  8,  8,  8,   8);
    diff = datePreciseRange(moment, date1, date2, true);
    assert.ok( !!diff );
    assert.equal( diff.years, 1 );
    assert.equal( diff.months, 4 );
    assert.equal( diff.days, 20 );
    assert.equal( diff.hours, 13 );
    assert.equal( diff.minutes, 25 );
    assert.equal( diff.seconds, 44 );
  });

  it('prints human friendly string', function() {
    var date1 = new Date(2017, 0, 22);
    var date2 = new Date(2017, 10, 13);
    diff = datePreciseRange(moment, date1, date2);
    assert.ok( !!diff );
    assert.equal( diff, '9 months 22 days' );
  });

  it('gives same result with reversed inputs', function() {
    var date1 = new Date(2017, 0, 22);
    var date2 = new Date(2017, 10, 13);
    diff = datePreciseRange(moment, date2, date1);
    assert.ok( !!diff );
    assert.equal( diff, '9 months 22 days' );
  });

  it('gives empty string for invalid inputs', function() {
    assert.equal(datePreciseRange(moment, new Date('abc'), new Date()), '');
    assert.equal(datePreciseRange(moment, null, new Date()), '');
  });

  it('accounts for leap year', function() {
    var leaps = [1600, 2000, 2004, 2008];
    var nonleaps = [1700, 1900, 2001, 2017];
    for(let year of leaps) {
      let d1 = new Date(year, 1, 20);
      let d2 = new Date(year, 2, 10);
      let diff = datePreciseRange(moment, d1, d2);
      assert.equal( diff, '19 days' );
    }
    for(let year of nonleaps) {
      let d1 = new Date(year, 1, 20);
      let d2 = new Date(year, 2, 10);
      let diff = datePreciseRange(moment, d1, d2);
      assert.equal( diff, '18 days' );
    }
  });

  it('uses plurals appropriately', function() {
    var d1 = new Date(2017, 0, 1, 1, 1, 1);
    var d2 = new Date(2018, 2, 2, 3, 2, 3);
    var diff = datePreciseRange(moment, d1, d2);
    assert.equal( diff, '1 year 2 months 1 day 2 hours 1 minute 2 seconds');
  });

  it('says "IDENTICAL" when dates are equal', function() {
    for(let i = 0; i < 100; i++) {
      let d = new Date(Math.floor(Math.random() * 30) + 1990,
                       Math.floor(Math.random() * 12),
                       Math.floor(Math.random() * 20) + 1,
                       Math.floor(Math.random() * 24)
      );
      assert.equal( datePreciseRange(moment, d, d), 'IDENTICAL' );
    }
  });
});
