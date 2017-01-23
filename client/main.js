'USE STRICT';
var parseDateStr = require('../utility/parse-date-string');
parseDateStr = parseDateStr.bind(null, chrono);

var dateDiff = require('../utility/date-diff');
var datePreciseRange = require('../utility/date-precise-range');
dateDiff = dateDiff.bind(null, moment);
datePreciseRange = datePreciseRange.bind(null, moment);

angular.module('timestamp', [])
.controller('timestampCtrl', function($scope, $interval) {
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

  $scope.update = function() {
    $scope.validDates = true;
    for(let i = 0; i < dates.length; i++) {
      dates[i] = parseDateStr($scope.times.inputs[i], true);
      $scope.validDates = !!($scope.validDates && dates[i]);
      $scope.times.outputs[i] = dates[i]
                                  ? !!$scope.opts.locales[i]
                                      ? dates[i].toLocaleString()
                                      : dates[i].toUTCString()
                                  : '';
    }

    if($scope.validDates) {
      let diffs = dateDiff(dates[0], dates[1]);
      let precise = datePreciseRange(dates[0], dates[1]);
      let timediffs = [];
      if($scope.opts.precise && precise) {
        $scope.times.precise = precise;
      }
      if(diffs) {
        for(key in diffs) {
          if($scope.opts[key]) {
              timediffs.push(diffs[key].toFixed(2) + ' ' + key + 's');
          }
        }
      }
      $scope.times.diffs = timediffs;
    }
  };

  $scope.toggle = function(n) {
    $scope.opts.locales[n] = !$scope.opts.locales[n];
  }

  $interval($scope.update, 1000);
})
.directive('timestamp', function() {
  return {
    templateUrl: './templates/timestamp.html',
    controller: 'timestampCtrl'
  }
});
