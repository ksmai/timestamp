'USE STRICT';
var moment = require('moment');
var chrono = require('chrono-node');
var dateDiff = require('../utility/date-diff');
var datePreciseRange = require('../utility/date-precise-range');
var parseDateStr = require('../utility/parse-date-string');

parseDateStr = parseDateStr.bind(null, chrono);
datePreciseRange = datePreciseRange.bind(null, moment);
dateDiff = dateDiff.bind(null, moment);

module.exports = function(express) {
  var api = express.Router();

  api.get('/time/:time', function(req, res) {
    var date = parseDateStr(req.params.time);
    if( !!date && !!date.getTime && !!date.getTime() ) {
      res.json({
        timestamp: date.getTime(),
        string: date.toUTCString()
      });
    }
    else {
      res.status(400).end();
    }
  });

  api.get('/timediff/:time1/:time2', function(req, res) {
    var date1 = parseDateStr(req.params.time1);
    var date2 = parseDateStr(req.params.time2);
    var diffs = dateDiff(date1, date2);
    if( !!diffs ) {
      diffs.precise = datePreciseRange(date1, date2);
      res.json(diffs);
    }
    else {
      res.status(400).end();
    }
  });

  api.use(function(err, req, res, next) {
      res.status(500).end();
  });

  return api;
};
