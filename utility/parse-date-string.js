'USE STRICT';

module.exports = function(chrono, str) {
  var date;
  // fall back to built-in Date for unix timestamp
  if( Number(str) ) {
    date = new Date( Number(str) );
  }
  else {
    date = chrono.parseDate(str);
    if(!date) {
      if(Date.parse(str)) {
        date = new Date(str);
        // treat input str as UTC time to remain consistent with chrono
        date.setTime(
            date.getTime() - date.getTimezoneOffset() * 60 * 1000
        );
      }
      else {
        date = null;
      }
    }
  }
  return date;
};
