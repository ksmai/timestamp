'USE STRICT';

// takes 2 Date objects, return their difference in various units
module.exports = function(moment, date1, date2) {
  if( !date1 || !date2 || !date1.getTime || !date1.getTime() ||
      !date2.getTime || !date2.getTime()
  ) {
    return null;
  }
  var d1 = moment(date1), d2 = moment(date2);
  if(d1.diff(d2) > 0) [d1, d2] = [d2, d1];
  return {
    year:        d2.diff(d1, 'years', true),
    month:       d2.diff(d1, 'months', true),
    day:         d2.diff(d1, 'days', true),
    hour:        d2.diff(d1, 'hours', true),
    minute:      d2.diff(d1, 'minutes', true),
    second:      d2.diff(d1, 'seconds', true),
    millisecond: d2.diff(d1)
  };
};
