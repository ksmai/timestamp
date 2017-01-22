var assert = require('assert');
var chrono = require('chrono-node');
var parseDateStr = require('./parse-date-string').bind(null, chrono);

describe('parseDateStr', function() {
  it('returns a Date object with valid inputs', function() {
    assert.ok( parseDateStr('1484983641934') instanceof Date );
    assert.ok( parseDateStr('21/1/2017') instanceof Date );
    assert.ok( parseDateStr('4th Feb 1999') instanceof Date );
    assert.ok( parseDateStr('January 21, 09') instanceof Date );
  });

  it('understands unix timestamps', function() {
    var d = parseDateStr('1484986381000');
    assert.ok( d instanceof Date );
    assert.equal( d.getUTCFullYear(), 2017);
    //getMonth() returns zero-based month
    assert.equal( d.getUTCMonth(), 1 - 1 ); 
    assert.equal( d.getUTCDate(), 21 );
    assert.equal( d.getUTCDay(), 6 );
    assert.equal( d.getUTCHours(), 8 );
    assert.equal( d.getUTCMinutes(), 13 );
  });

  it('understands different date separators', function() {
    var separators = ['.', ' ', '. ', '/', '-', ','];
    var testDate = [2017, 1, 21];
    for(let sep of separators) {
      let d = parseDateStr( testDate.join(sep) );
      assert.equal( d.getUTCFullYear(), testDate[0] );
      assert.equal( d.getUTCMonth(), testDate[1] - 1 );
      assert.equal( d.getUTCDate(), testDate[2] );
    }
  });

  it('understands different month names/abbr', function() {
    var months = ['January',   'February', 'March',    'April',
                  'May',       'June',     'July',     'August',
                  'September', 'October',  'November', 'December'];
    var year = 2017, date = 21;
    for(let month of months) { 
      for(let len = month.length; len >= 3; len--) {
        let d = parseDateStr( `${date} ${month.slice(0, len)} ${year}` );
        assert.ok( !!d );
        assert.equal( d.getUTCFullYear(), year);
        assert.equal( d.getUTCMonth(), months.indexOf(month) );
        assert.equal( d.getUTCDate(), date);
      }
    }

  });

  it('understands different orders of date', function() {
    var year = 2017, month = 'Jan', date = 21;
    var orders = [
                    `${year} ${month} ${date}`,
                    `${month} ${date} ${year}`,
                    `${date} ${month} ${year}`
    ];
    for(let order of orders) {
      let d = parseDateStr(order);
      assert.ok( !!d );
      assert.equal( d.getUTCFullYear(), year );
      assert.equal( d.getUTCMonth(), 0 );
      assert.equal( d.getUTCDate(), date );
    }
  });

  it('understands 2-digit year', function() {
    var years = [1998, 2008], month = 12, date = 25;
    for(let year of years) {
      let d = parseDateStr(`${date}-${month}-${year.toString().slice(2)}`);
      assert.ok( !!d );
      assert.equal( d.getUTCFullYear(), year );
      assert.equal( d.getUTCMonth(), 12 - 1 );
      assert.equal( d.getUTCDate(), date );
    }
  });

  it('understands 12/24 hours time', function() {
    var date = '21st Jan, 2017 ',
        times = [
          {str: '20:42', h: 20, m: 42},
          {str: '20:03:42', h: 20, m: 3, s: 42},
          {str: '3:42:3', h: 3, m: 42, s: 3},
          {str: '12 AM', h: 0},
          {str: '12:1 AM', h: 0, m: 1},
          {str: '3:42:42 pm', h: 15, m: 42, s: 42}
    ];
    for(let time of times) {
      let d = parseDateStr( date + time.str );
      assert.ok( !!d );
      assert.equal( d.getHours(), time.h || 0 );
      assert.equal( d.getMinutes(), time.m || 0 );
      assert.equal( d.getSeconds(), time.s || 0 );
    }
  });

  it('understands simple time vocabulary', function() {
    var d = parseDateStr('21-01-17 Noon');
    assert.ok( !!d );
    assert.equal( d.getHours(), 12 );
  });
});
