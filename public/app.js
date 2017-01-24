"use strict";

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    'USE STRICT';

    var parseDateStr = require('../utility/parse-date-string');
    parseDateStr = parseDateStr.bind(null, chrono);

    var dateDiff = require('../utility/date-diff');
    var datePreciseRange = require('../utility/date-precise-range');
    dateDiff = dateDiff.bind(null, moment);
    datePreciseRange = datePreciseRange.bind(null, moment);

    angular.module('timestamp', ['ng']).controller('timestampCtrl', function ($scope, $interval) {
      $scope.times = {
        inputs: ['', ''],
        outputs: ['', ''],
        diffs: [],
        precise: ''
      };
      $scope.opts = {
        locales: [true, true],
        precise: true,
        year: false,
        month: false,
        day: false,
        hour: false,
        minute: false,
        second: false
      };
      $scope.validDates = false;

      var dates = [null, null];

      $scope.update = function () {
        $scope.validDates = true;
        for (var i = 0; i < dates.length; i++) {
          dates[i] = parseDateStr($scope.times.inputs[i], true);
          $scope.validDates = !!($scope.validDates && dates[i] && dates[i].getTime());
          $scope.times.outputs[i] = dates[i] && dates[i].getTime() ? !!$scope.opts.locales[i] ? dates[i].toLocaleString() : dates[i].toUTCString() : '';
        }

        if ($scope.validDates) {
          var diffs = dateDiff(dates[0], dates[1]);
          var precise = datePreciseRange(dates[0], dates[1]);
          var timediffs = [];
          if ($scope.opts.precise && precise) {
            $scope.times.precise = precise;
          }
          if (diffs) {
            for (key in diffs) {
              if ($scope.opts[key]) {
                timediffs.push(diffs[key].toFixed(2) + ' ' + key + 's');
              }
            }
          }
          $scope.times.diffs = timediffs;
        }
      };

      $scope.toggle = function (n) {
        $scope.opts.locales[n] = !$scope.opts.locales[n];
      };

      $interval($scope.update, 1000);

      setTimeout(function () {
        $scope.$emit('timestampCtrl');
      }, 0);
    }).directive('timestamp', function () {
      return {
        templateUrl: './templates/timestamp.html',
        controller: 'timestampCtrl'
      };
    }).directive('timestampIntro', function () {
      return {
        templateUrl: './templates/timestamp-intro.html'
      };
    });
  }, { "../utility/date-diff": 2, "../utility/date-precise-range": 3, "../utility/parse-date-string": 4 }], 2: [function (require, module, exports) {
    'USE STRICT';

    // takes 2 Date objects, return their difference in various units

    module.exports = function (moment, date1, date2) {
      if (!date1 || !date2 || !date1.getTime || !date1.getTime() || !date2.getTime || !date2.getTime()) {
        return null;
      }
      var d1 = moment(date1),
          d2 = moment(date2);
      if (d1.diff(d2) > 0) {
        ;
        var _ref = [d2, d1];
        d1 = _ref[0];
        d2 = _ref[1];
      }return {
        year: d2.diff(d1, 'years', true),
        month: d2.diff(d1, 'months', true),
        day: d2.diff(d1, 'days', true),
        hour: d2.diff(d1, 'hours', true),
        minute: d2.diff(d1, 'minutes', true),
        second: d2.diff(d1, 'seconds', true),
        millisecond: d2.diff(d1)
      };
    };
  }, {}], 3: [function (require, module, exports) {
    'USE STRICT';

    module.exports = function (moment, date1, date2) {
      var debug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (!date1 || !date1.getTime || !date1.getTime() || !date2 || !date2.getTime || !date2.getTime()) {
        return '';
      }

      if (date1.getTime() > date2.getTime()) {
        var _ref2 = [date2, date1];
        date1 = _ref2[0];
        date2 = _ref2[1];
      }

      //adopted from npm package: moment-precise-range-plugin
      (function (moment) {
        var STRINGS = {
          nodiff: '',
          year: 'year',
          years: 'years',
          month: 'month',
          months: 'months',
          day: 'day',
          days: 'days',
          hour: 'hour',
          hours: 'hours',
          minute: 'minute',
          minutes: 'minutes',
          second: 'second',
          seconds: 'seconds',
          delimiter: ' '
        };

        function pluralize(num, word) {
          return num + ' ' + STRINGS[word + (num === 1 ? '' : 's')];
        }

        function buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff) {
          var result = [];

          if (yDiff) {
            result.push(pluralize(yDiff, 'year'));
          }
          if (mDiff) {
            result.push(pluralize(mDiff, 'month'));
          }
          if (dDiff) {
            result.push(pluralize(dDiff, 'day'));
          }
          if (hourDiff) {
            result.push(pluralize(hourDiff, 'hour'));
          }
          if (minDiff) {
            result.push(pluralize(minDiff, 'minute'));
          }
          if (secDiff) {
            result.push(pluralize(secDiff, 'second'));
          }

          return result.join(STRINGS.delimiter);
        }

        moment.fn.preciseDiff = function (d2, returnValueObject) {
          return moment.preciseDiff(this, d2, returnValueObject);
        };

        moment.preciseDiff = function (d1, d2, returnValueObject) {
          var m1 = moment(d1),
              m2 = moment(d2),
              firstDateWasLater;

          m1.add(m2.utcOffset() - m1.utcOffset(), 'minutes'); // shift timezone of m1 to m2

          if (m1.isSame(m2)) {
            return STRINGS.nodiff;
          }
          if (m1.isAfter(m2)) {
            var tmp = m1;
            m1 = m2;
            m2 = tmp;
            firstDateWasLater = true;
          } else {
            firstDateWasLater = false;
          }

          var yDiff = m2.year() - m1.year();
          var mDiff = m2.month() - m1.month();
          var dDiff = m2.date() - m1.date();
          var hourDiff = m2.hour() - m1.hour();
          var minDiff = m2.minute() - m1.minute();
          var secDiff = m2.second() - m1.second();

          if (secDiff < 0) {
            secDiff = 60 + secDiff;
            minDiff--;
          }
          if (minDiff < 0) {
            minDiff = 60 + minDiff;
            hourDiff--;
          }
          if (hourDiff < 0) {
            hourDiff = 24 + hourDiff;
            dDiff--;
          }
          if (dDiff < 0) {
            var daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), "YYYY-MM").subtract(1, 'M').daysInMonth();
            if (daysInLastFullMonth < m1.date()) {
              // 31/01 -> 2/03
              dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
            } else {
              dDiff = daysInLastFullMonth + dDiff;
            }
            mDiff--;
          }
          if (mDiff < 0) {
            mDiff = 12 + mDiff;
            yDiff--;
          }

          if (returnValueObject) {
            return {
              "years": yDiff,
              "months": mDiff,
              "days": dDiff,
              "hours": hourDiff,
              "minutes": minDiff,
              "seconds": secDiff,
              "firstDateWasLater": firstDateWasLater
            };
          } else {
            return buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff);
          }
        };
      })(moment);
      return moment.preciseDiff(moment(date1), moment(date2), debug) || 'IDENTICAL';
    };
  }, {}], 4: [function (require, module, exports) {
    'USE STRICT';

    module.exports = function (chrono, str) {
      var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var date;
      // fall back to built-in Date for unix timestamp
      if (Number(str)) {
        date = new Date(Number(str));
      } else {
        date = chrono.parseDate(str);
        if (!date) {
          if (Date.parse(str)) {
            date = new Date(str);
          } else {
            date = null;
          }
        }

        if (date && !locale) {
          date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        }
      }
      return date;
    };
  }, {}] }, {}, [1]);