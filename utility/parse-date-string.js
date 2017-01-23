'USE STRICT';

module.exports = function(chrono, str, locale = false) {
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
      }
      else {
        date = null;
      }
    }
    
    if(date && !locale) {
      date.setTime(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      );
    }
  }
  return date;
};
