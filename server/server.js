"USE STRICT";

var path = require('path');
var express = require('express');
var wagner = require('wagner-core');
var api = require('./api');

var publicDir = path.join(__dirname, '/../public');
var app = express();

wagner.factory('express', function() {
  return express;
});

app.use(express.static(publicDir));

app.get('/', function(req, res) {
  res.sendfile('index.html', {
    root: publicDir
  });
});

app.use('/api/', wagner.invoke(api));

module.exports = function(port = 3000) {
  app.listen(port);
  console.log(`Listening on port ${port}`);
};
