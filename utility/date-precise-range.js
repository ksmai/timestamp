'USE STRICT';
var moment = require('moment');
require('moment-precise-range-plugin');

var preciseDiff = moment.preciseDiff;

module.exports = function(date1, date2, debug = false) {
  if(!date1 || !date1.getTime || !date1.getTime() ||
     !date2 || !date2.getTime || !date2.getTime())
  {
    return '';
  }
  return preciseDiff(moment(date1), moment(date2), debug);
};
