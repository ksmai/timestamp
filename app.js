var server = require(__dirname + '/server/server');
var config = require(__dirname + '/config.json');
var port = parseInt(config.port);

server(port);
